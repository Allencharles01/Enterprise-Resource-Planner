import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { OrganizationModel } from "dbms/Organization.js";

export const orgRouter = Router();

orgRouter.get("/me", requireAuth, async (req, res) => {
  const orgId = req.auth.orgId;
  const org = await OrganizationModel.findById(orgId);
  if (!org) return res.status(404).json({ error: "org_not_found" });
  res.json({ id: String(org._id), name: org.name, slug: org.slug });
});
