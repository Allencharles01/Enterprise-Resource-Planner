import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { OrganizationModel } from "dbms/Organization.js";
import { UserModel } from "dbms/User.js";
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

  const { orgSlug, email, adminId, isAdmin, password } = input.data;
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
  } else if (orgSlug && email) {
    // Employee login
    org = await OrganizationModel.findOne({ slug: orgSlug });
    if (!org) return res.status(401).json({ error: "invalid_credentials" });

    user = await UserModel.findOne({
      orgId: org._id,
      email: email.toLowerCase(),
      isActive: true,
    });
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
