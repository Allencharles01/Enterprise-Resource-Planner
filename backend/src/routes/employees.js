import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { EmployeeModel } from "dbms/Employee.js";

export const employeesRouter = Router();

employeesRouter.get("/", requireAuth, async (req, res) => {
  const orgId = req.auth.orgId;
  const employees = await EmployeeModel.find({ orgId })
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(
    employees.map((e) => ({
      id: String(e._id),
      employeeCode: e.employeeCode,
      personal: e.personal,
      work: e.work,
    })),
  );
});

const CreateEmployeeSchema = z.object({
  employeeCode: z.string().min(1),
  employeeNumber: z.string().optional(),
  personal: z.object({
    firstName: z.string().min(1),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    contactEmail: z.string().optional(),
  }),
  work: z
    .object({
      department: z.string().optional(),
      designation: z.string().optional(),
      companyEmail: z.string().optional(),
      manager: z.string().optional(),
      joiningDate: z.string().optional(),
    })
    .optional(),
});

employeesRouter.post(
  "/",
  requireAuth,
  requireRole(["org_admin", "hr"]),
  async (req, res) => {
    const input = CreateEmployeeSchema.safeParse(req.body);
    if (!input.success)
      return res
        .status(400)
        .json({ error: "invalid_input", issues: input.error.issues });

    const orgId = req.auth.orgId;
    const joiningDate = input.data.work?.joiningDate
      ? new Date(input.data.work.joiningDate)
      : undefined;
    const employee = await EmployeeModel.create({
      orgId,
      employeeCode: input.data.employeeCode,
      personal: input.data.personal,
      work: {
        ...input.data.work,
        joiningDate,
        status: "active",
      },
    });

    res.status(201).json({ id: String(employee._id) });
  },
);

const DeleteEmployeeSchema = z.object({
  employeeCode: z.string().optional(),
  employeeNumber: z.string().optional(),
  companyEmail: z.string().optional(),
});

employeesRouter.delete(
  "/",
  requireAuth,
  requireRole(["org_admin", "super_admin"]),
  async (req, res) => {
    const input = DeleteEmployeeSchema.safeParse(req.body);
    if (!input.success) return res.status(400).json({ error: "invalid_input" });

    const { employeeCode, employeeNumber, companyEmail } = input.data;
    if (!employeeCode && !employeeNumber && !companyEmail) {
      return res
        .status(400)
        .json({
          error: "Must provide employeeCode, employeeNumber, or companyEmail",
        });
    }

    const orgId = req.auth.orgId;
    const query = { orgId };
    if (employeeCode) query.employeeCode = employeeCode;
    if (employeeNumber) query.employeeNumber = employeeNumber;
    if (companyEmail) query["work.companyEmail"] = companyEmail;

    const result = await EmployeeModel.findOneAndDelete(query);
    if (!result) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ success: true, message: "Employee removed successfully" });
  },
);
