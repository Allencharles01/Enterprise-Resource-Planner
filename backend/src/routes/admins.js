import { Router } from "express";
import { EmployeeModel } from "dbms/Employee.js";
import { UserModel } from "dbms/User.js";
import { requireAuth } from "../middleware/requireAuth.js";
import bcrypt from "bcryptjs";

export const adminsRouter = Router();

adminsRouter.get("/", requireAuth, async (req, res) => {
  try {
    const orgId = req.auth?.orgId;
    if (!orgId) return res.status(401).json({ error: "Unauthorized" });

    const adminUsers = await UserModel.find({
      orgId,
      role: { $in: ["org_admin", "super_admin"] },
      isActive: true,
    }).lean();

    const adminUserIds = adminUsers.map((u) => u._id);

    const employees = await EmployeeModel.find({
      orgId,
      userId: { $in: adminUserIds },
    }).lean();

    const formattedAdmins = adminUsers.map((user) => {
      const emp = employees.find(
        (e) => e.userId?.toString() === user._id.toString(),
      );
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        employeeId: emp?.employeeCode || null,
      };
    });

    res.json(formattedAdmins);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admins" });
  }
});

adminsRouter.post("/", requireAuth, async (req, res) => {
  try {
    const orgId = req.auth?.orgId;
    if (!orgId) return res.status(401).json({ error: "Unauthorized" });

    const { name, adminId, password } = req.body;
    // Check if employee with adminId already exists to grant admin rights
    let employee = await EmployeeModel.findOne({
      orgId,
      employeeCode: adminId,
    });
    if (employee) {
      const user = await UserModel.findById(employee.userId);
      if (user) {
        user.role = "org_admin";
        await user.save();
        return res
          .status(200)
          .json({
            success: true,
            message: "Granted admin rights to existing employee",
          });
      }
    }

    // Create a generic email for new direct admins
    const email = `${adminId.toLowerCase().replace(/[^a-z0-9]/g, "")}@novanectar.demo`;
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await UserModel.create({
      orgId,
      name,
      email,
      passwordHash,
      role: "org_admin",
      isActive: true,
    });

    const [firstName, ...lastNameParts] = name.split(" ");
    await EmployeeModel.create({
      orgId,
      userId: newUser._id,
      employeeCode: adminId,
      personal: {
        firstName,
        lastName: lastNameParts.join(" "),
      },
      work: {
        department: "Administration",
        designation: "Administrator",
        status: "active",
      },
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to create admin" });
  }
});

adminsRouter.delete("/", requireAuth, async (req, res) => {
  try {
    const orgId = req.auth?.orgId;
    const currentUserId = req.auth?.userId;
    if (!orgId || !currentUserId)
      return res.status(401).json({ error: "Unauthorized" });

    const { employeeId, password } = req.body;

    const currentUser = await UserModel.findById(currentUserId);
    if (!currentUser)
      return res.status(404).json({ error: "Current user not found" });

    const isMatch = await bcrypt.compare(password, currentUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect admin password" });
    }

    const employeeToRemove = await EmployeeModel.findOne({
      orgId,
      employeeCode: employeeId,
    });
    if (!employeeToRemove) {
      return res.status(404).json({ error: "Admin employee not found" });
    }

    const targetUser = await UserModel.findById(employeeToRemove.userId);
    if (!targetUser) {
      return res.status(404).json({ error: "Admin user not found" });
    }

    if (targetUser._id.toString() === currentUserId.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot remove your own admin privileges" });
    }

    targetUser.role = "employee"; // Downgrade to employee
    await targetUser.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove admin" });
  }
});
