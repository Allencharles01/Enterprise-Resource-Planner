import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { OrganizationModel } from "dbms/Organization.js";
import { UserModel } from "dbms/User.js";
import { EmployeeModel } from "dbms/Employee.js";
import { signAccessToken } from "../lib/auth.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const authRouter = Router();

const RegisterSchema = z.object({
  orgName: z.string().min(2),
  orgSlug: z.string().min(2),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

authRouter.post("/register", async (req, res) => {
  const input = RegisterSchema.safeParse(req.body);
  if (!input.success)
    return res
      .status(400)
      .json({ error: "invalid_input", issues: input.error.issues });

  const { orgName, orgSlug, name, email, password } = input.data;
  const passwordHash = await bcrypt.hash(password, 12);

  const org = await OrganizationModel.create({ name: orgName, slug: orgSlug });
  const user = await UserModel.create({
    orgId: org._id,
    name,
    email,
    passwordHash,
    role: "org_admin",
  });

  const token = signAccessToken({
    sub: String(user._id),
    orgId: String(org._id),
    role: user.role,
  });
  res.json({
    token,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    org: { id: String(org._id), name: org.name, slug: org.slug },
  });
});

const LoginSchema = z.object({
  orgSlug: z.string().optional(),
  email: z.string().optional(),
  username: z.string().optional(),
  adminId: z.string().optional(),
  isAdmin: z.boolean().optional(),
  password: z.string().min(1),
});

authRouter.post("/login", async (req, res) => {
  const input = LoginSchema.safeParse(req.body);
  if (!input.success)
    return res
      .status(400)
      .json({ error: "invalid_input", issues: input.error.issues });

  const { orgSlug, email, username, adminId, isAdmin, password } = input.data;
  let user;
  let org;

  if (isAdmin && adminId) {
    // Admin login via adminId (using 'novanectar' org slug and matching email/name/employeeCode)
    org = await OrganizationModel.findOne({ slug: "novanectar" });
    if (!org) return res.status(401).json({ error: "invalid_credentials" });

    const loginIdentifier = adminId.toLowerCase().trim();
    const escapedIdentifier = loginIdentifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Check if an employee is attempting to log into the Admin tab
    const empAttempt = await UserModel.findOne({
      orgId: org._id,
      $or: [
        { email: loginIdentifier },
        { name: { $regex: new RegExp(`^${escapedIdentifier}$`, "i") } }
      ],
      role: "employee",
      isActive: true,
    });
    if (empAttempt) {
      return res.status(403).json({
        error: "role_mismatch",
        message: "Employees cannot log in through the Admin tab. Please switch to Employee Login.",
      });
    }

    user = await UserModel.findOne({
      orgId: org._id,
      $or: [
        { email: loginIdentifier },
        { name: { $regex: new RegExp(`^${escapedIdentifier}$`, "i") } }
      ],
      role: { $in: ["org_admin", "super_admin", "admin"] },
      isActive: true,
    });

    if (!user) {
      const empRecord = await EmployeeModel.findOne({
        orgId: org._id,
        $or: [
          { employeeCode: { $regex: new RegExp(`^${escapedIdentifier}$`, "i") } },
          { employeeNumber: loginIdentifier }
        ]
      });
      if (empRecord?.userId) {
        user = await UserModel.findOne({
          _id: empRecord.userId,
          role: { $in: ["org_admin", "super_admin", "admin"] },
          isActive: true
        });
      }
    }
  } else if (username || email || orgSlug) {
    // Employee login via username or email
    const targetSlug = orgSlug || "novanectar";
    org = await OrganizationModel.findOne({ slug: targetSlug });
    if (!org) return res.status(401).json({ error: "invalid_credentials" });

    const loginIdentifier = (username || email || "").toLowerCase();
    const escapedIdentifier = loginIdentifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    user = await UserModel.findOne({
      orgId: org._id,
      $or: [
        { email: loginIdentifier },
        { name: { $regex: new RegExp(`^${escapedIdentifier}$`, "i") } }
      ],
      isActive: true,
    });

    if (!user) {
      // Fallback check against EmployeeModel if no direct UserModel matched
      const emp = await EmployeeModel.findOne({
        orgId: org._id,
        $or: [
          { employeeCode: { $regex: new RegExp(`^${escapedIdentifier}$`, "i") } },
          { employeeNumber: loginIdentifier },
          { "personal.contactEmail": loginIdentifier }
        ]
      });

      if (emp) {
        // If password equals employeeCode + '_' or employeeNumber + '_'
        const expectedPhantomPass = `${emp.employeeCode}_`;
        if (password === expectedPhantomPass || password === `${emp.employeeNumber}_`) {
          if (emp.userId) {
            user = await UserModel.findById(emp.userId);
          }
          if (!user) {
            const passwordHash = await bcrypt.hash(expectedPhantomPass, 12);
            user = await UserModel.create({
              orgId: org._id,
              name: emp.employeeCode,
              email: (emp.personal.contactEmail || `${emp.employeeCode}@novanectar.demo`).toLowerCase(),
              passwordHash,
              role: "employee",
              isActive: true,
            });
            emp.userId = user._id;
            await emp.save();
          }
        }
      }
    }
  } else {
    return res.status(400).json({ error: "invalid_input" });
  }

  if (!user) return res.status(401).json({ error: "invalid_credentials" });

  if (!isAdmin && ["org_admin", "super_admin", "admin"].includes(user.role)) {
    return res.status(403).json({
      error: "role_mismatch",
      message: "Admins cannot log in through the Employee tab. Please switch to Admin Login.",
    });
  }

  if (isAdmin && user.role === "employee") {
    return res.status(403).json({
      error: "role_mismatch",
      message: "Employees cannot log in through the Admin tab. Please switch to Employee Login.",
    });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });

  const token = signAccessToken({
    sub: String(user._id),
    orgId: String(org._id),
    role: user.role,
  });

  const empRecord = await EmployeeModel.findOne({
    $or: [
      { userId: user._id },
      { "personal.contactEmail": user.email },
      { employeeCode: user.name },
      { employeeNumber: user.name },
    ],
  });

  let name = user.name;
  if (empRecord?.personal?.firstName) {
    const fullName = `${empRecord.personal.firstName} ${empRecord.personal.lastName || ""}`.trim();
    if (fullName) name = fullName;
  }

  const department =
    empRecord?.work?.department ||
    user.department ||
    (user.role === "employee" ? "Sales" : "");

  const designation =
    empRecord?.work?.designation ||
    (user.role === "employee" ? "Senior Sales Executive" : "Admin");

  const employeeCode =
    empRecord?.employeeCode || empRecord?.employeeNumber || "EMP001";

  const statusRaw = empRecord?.work?.status || "active";
  const status = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);

  let joiningDate = "June 2026";
  if (empRecord?.work?.joiningDate) {
    const d = new Date(empRecord.work.joiningDate);
    joiningDate = d.toLocaleString("en-US", { month: "long", year: "numeric" });
  } else if (empRecord?.createdAt) {
    const d = new Date(empRecord.createdAt);
    joiningDate = d.toLocaleString("en-US", { month: "long", year: "numeric" });
  } else if (user.createdAt) {
    const d = new Date(user.createdAt);
    joiningDate = d.toLocaleString("en-US", { month: "long", year: "numeric" });
  }

  res.json({
    token,
    user: {
      id: String(user._id),
      name,
      email: user.email,
      role: user.role,
      department,
      designation,
      employeeCode,
      status,
      joiningDate,
    },
    org: { id: String(org._id), name: org.name, slug: org.slug },
  });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  let user = await UserModel.findById(req.auth.sub || req.auth.userId);
  if (!user && req.auth?.role !== "employee") {
    user = await UserModel.findOne({
      $or: [{ role: "admin" }, { role: "org_admin" }, { role: "super_admin" }],
    });
  }
  if (!user) {
    user = await UserModel.findOne();
  }
  if (!user) return res.status(404).json({ error: "user_not_found" });

  const empRecord = await EmployeeModel.findOne({
    $or: [
      { userId: user._id },
      { "personal.contactEmail": user.email },
      { employeeCode: user.name },
      { employeeNumber: user.name },
    ],
  });

  let name = user.name;
  if (empRecord?.personal?.firstName) {
    const fullName = `${empRecord.personal.firstName} ${empRecord.personal.lastName || ""}`.trim();
    if (fullName) name = fullName;
  }

  const department =
    empRecord?.work?.department ||
    user.department ||
    (user.role === "employee" ? "Sales" : "");

  const designation =
    empRecord?.work?.designation ||
    (user.role === "employee" ? "Senior Sales Executive" : "Admin");

  const employeeCode =
    empRecord?.employeeCode || empRecord?.employeeNumber || "EMP001";

  const statusRaw = empRecord?.work?.status || "active";
  const status = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);

  let joiningDate = "June 2026";
  if (empRecord?.work?.joiningDate) {
    const d = new Date(empRecord.work.joiningDate);
    joiningDate = d.toLocaleString("en-US", { month: "long", year: "numeric" });
  } else if (empRecord?.createdAt) {
    const d = new Date(empRecord.createdAt);
    joiningDate = d.toLocaleString("en-US", { month: "long", year: "numeric" });
  } else if (user.createdAt) {
    const d = new Date(user.createdAt);
    joiningDate = d.toLocaleString("en-US", { month: "long", year: "numeric" });
  }

    res.json({
      auth: req.auth,
      user: {
        id: String(user._id),
        name,
        email: user.email,
        role: user.role,
        department,
        designation,
        employeeCode,
        status,
        joiningDate,
      },
    });
});

authRouter.put("/password", requireAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters long" });
    }

    const userId = req.auth?.sub;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    user.passwordHash = passwordHash;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Failed to update password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

