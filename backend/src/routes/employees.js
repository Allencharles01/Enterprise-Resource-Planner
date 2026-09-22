import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { EmployeeModel } from "dbms/Employee.js";
import { UserModel } from "dbms/User.js";

export const employeesRouter = Router();

employeesRouter.get("/", requireAuth, async (req, res) => {
  const orgId = req.auth.orgId;
  const employees = await EmployeeModel.find({ orgId })
    .populate("userId", "email name role")
    .sort({ employeeNumber: 1, createdAt: 1 })
    .limit(5000);
  res.json(
    employees.map((e) => {
      const u = e.userId && typeof e.userId === "object" ? e.userId : null;
      const uEmail = u?.email || "";
      const contactEmail = e.personal?.contactEmail || uEmail || "";
      const companyEmail = e.work?.companyEmail || "";

      // Asynchronously heal missing contactEmail in DB if linked user has an email
      if (!e.personal?.contactEmail && uEmail) {
        EmployeeModel.updateOne(
          { _id: e._id },
          { $set: { "personal.contactEmail": uEmail } },
        ).catch(() => {});
      }

      return {
        id: String(e._id),
        employeeCode: e.employeeCode,
        employeeNumber: e.employeeNumber,
        tag: e.tag,
        isPhantom: e.isPhantom,
        userEmail: uEmail,
        personal: {
          ...(e.personal?.toObject ? e.personal.toObject() : e.personal || {}),
          contactEmail: contactEmail || undefined,
        },
        work: {
          ...(e.work?.toObject ? e.work.toObject() : e.work || {}),
          companyEmail: companyEmail || undefined,
        },
      };
    }),
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

const UpdateEmployeeSchema = z.object({
  employeeCode: z.string().optional(),
  personal: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      contactEmail: z.string().optional(),
    })
    .optional(),
  work: z
    .object({
      department: z.string().optional(),
      designation: z.string().optional(),
      companyEmail: z.string().optional(),
      manager: z.string().optional(),
      status: z.string().optional(),
    })
    .optional(),
});

employeesRouter.put(
  "/:id",
  requireAuth,
  requireRole(["org_admin", "super_admin", "hr", "manager"]),
  async (req, res) => {
    const input = UpdateEmployeeSchema.safeParse(req.body);
    if (!input.success)
      return res
        .status(400)
        .json({ error: "invalid_input", issues: input.error.issues });

    const orgId = req.auth.orgId;
    const { id } = req.params;

    const employee = await EmployeeModel.findOne({ _id: id, orgId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    if (input.data.employeeCode !== undefined) {
      employee.employeeCode = input.data.employeeCode;
    }
    if (input.data.personal) {
      employee.personal = { ...employee.personal, ...input.data.personal };
    }
    if (input.data.work) {
      employee.work = { ...employee.work, ...input.data.work };
    }

    await employee.save();

    if (employee.userId && input.data.personal?.contactEmail) {
      UserModel.updateOne(
        { _id: employee.userId },
        { $set: { email: input.data.personal.contactEmail.toLowerCase() } },
      ).catch(() => {});
    }

    res.json({ success: true, employee });
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
