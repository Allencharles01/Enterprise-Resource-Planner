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
    // Admin login via adminId (using 'novanectar' org slug and matching email field to adminId)
    org = await OrganizationModel.findOne({ slug: "novanectar" });
    if (!org) return res.status(401).json({ error: "invalid_credentials" });
    user = await UserModel.findOne({
      orgId: org._id,
      email: adminId.toLowerCase(),
      role: { $in: ["org_admin", "super_admin"] },
      isActive: true,
    });
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

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });

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

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await UserModel.findById(req.auth.sub);
  res.json({ auth: req.auth, user: { name: user?.name } });
});
