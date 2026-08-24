import { Router } from "express";
import { EmployeeModel } from "dbms/Employee.js";
import { UserModel } from "dbms/User.js";
import { requireAuth } from "../middleware/requireAuth.js";
import bcrypt from "bcryptjs";

// Import all other models for master deletion
import Project from "dbms/Project.js";
import Task from "dbms/Task.js";
import InternshipCandidate from "dbms/InternshipCandidate.js";
import InternshipCourse from "dbms/InternshipCourse.js";
import TrainingCandidate from "dbms/TrainingCandidate.js";
import TrainingCourse from "dbms/TrainingCourse.js";
import CustomerInquiry from "dbms/CustomerInquiry.js";
import EmailLog from "dbms/EmailLog.js";
import { ContactListModel } from "dbms/ContactList.js";
import { CSVDocModel } from "dbms/CSVDoc.js";
import Ticket from "dbms/Ticket.js";
import InternalChat from "dbms/InternalChat.js";
import Notification from "dbms/Notification.js";
import ProfileChangeRequest from "dbms/ProfileChangeRequest.js";
import AccountRequest from "dbms/AccountRequest.js";

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

// Master Delete / Factory Reset Endpoint
adminsRouter.post("/master-delete", requireAuth, async (req, res) => {
  try {
    const orgId = req.auth?.orgId;
    const currentUserId = req.auth?.userId;
    if (!orgId || !currentUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { target, password } = req.body;
    if (!["all", "employees", "projects", "marketing"].includes(target)) {
      return res.status(400).json({ error: "Invalid target" });
    }

    const currentUser = await UserModel.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    const isMatch = await bcrypt.compare(password, currentUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect admin password" });
    }

    // Now execute deletion based on target
    if (target === "all") {
      await Promise.all([
        UserModel.deleteMany({ _id: { $ne: currentUserId } }),
        EmployeeModel.deleteMany({ userId: { $ne: currentUserId } }),
        Project.deleteMany({}),
        Task.deleteMany({}),
        AccountRequest.deleteMany({}),
        CSVDocModel.deleteMany({}),
        ContactListModel.deleteMany({}),
        CustomerInquiry.deleteMany({}),
        EmailLog.deleteMany({}),
        InternalChat.deleteMany({}),
        InternshipCandidate.deleteMany({}),
        InternshipCourse.deleteMany({}),
        Notification.deleteMany({}),
        ProfileChangeRequest.deleteMany({}),
        Ticket.deleteMany({}),
        TrainingCandidate.deleteMany({}),
        TrainingCourse.deleteMany({}),
      ]);
    } else if (target === "employees") {
      await Promise.all([
        UserModel.deleteMany({ _id: { $ne: currentUserId }, role: { $in: ["employee", "hr", "manager"] } }),
        EmployeeModel.deleteMany({ userId: { $ne: currentUserId } }),
        AccountRequest.deleteMany({}),
        InternalChat.deleteMany({}),
        Notification.deleteMany({}),
        ProfileChangeRequest.deleteMany({}),
        Ticket.deleteMany({}),
      ]);
    } else if (target === "projects") {
      await Promise.all([
        Project.deleteMany({}),
        Task.deleteMany({}),
      ]);
    } else if (target === "marketing") {
      // Find all projects that are NOT the ERP project
      const erpProject = await Project.findOne({
        $or: [
          { name: "ERP" },
          { client: "NovaNectar Services Pvt Ltd" },
          { client: "NovaNectar Pvt Ltd" }
        ]
      });

      const erpProjectId = erpProject ? erpProject._id : null;

      // We will delete all projects except ERP
      const projectsToDelete = await Project.find(
        erpProjectId ? { _id: { $ne: erpProjectId } } : {}
      );
      const projectIdsToDelete = projectsToDelete.map((p) => p._id);

      // Find employees in Digital Marketing
      const marketingEmployees = await EmployeeModel.find({
        "work.department": { $regex: /marketing|digital/i }
      });
      const marketingUserIds = marketingEmployees
        .map((e) => e.userId)
        .filter((id) => id && id.toString() !== currentUserId.toString());

      await Promise.all([
        Project.deleteMany({ _id: { $in: projectIdsToDelete } }),
        Task.deleteMany({ projectId: { $in: projectIdsToDelete } }),
        EmployeeModel.deleteMany({
          "work.department": { $regex: /marketing|digital/i },
          userId: { $ne: currentUserId }
        }),
        UserModel.deleteMany({ _id: { $in: marketingUserIds } }),
        Notification.deleteMany({
          $or: [
            { title: { $regex: /marketing|digital/i } },
            { message: { $regex: /marketing|digital/i } }
          ]
        })
      ]);
    }

    res.json({ success: true, message: `Successfully deleted ${target}` });
  } catch (error) {
    console.error("Master delete error:", error);
    res.status(500).json({ error: "Failed to perform master delete operation" });
  }
});
