import { Schema, model } from "mongoose";

const EmployeeSchema = new Schema(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    employeeCode: { type: String, required: true, trim: true },
    employeeNumber: { type: String, trim: true },
    tag: { type: String, trim: true, index: true },
    isPhantom: { type: Boolean, default: false, index: true },
    personal: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, trim: true },
      contactEmail: { type: String, trim: true },
      phone: { type: String, trim: true },
      dob: { type: Date },
      address: { type: String, trim: true },
    },
    work: {
      department: { type: String, trim: true },
      designation: { type: String, trim: true },
      companyEmail: { type: String, trim: true },
      manager: { type: String, trim: true },
      joiningDate: { type: Date },
      exitDate: { type: Date },
      status: {
        type: String,
        enum: ["active", "inactive", "exited"],
        default: "active",
      },
    },
    payroll: {
      bankName: { type: String, trim: true },
      accountNumberLast4: { type: String, trim: true },
      ifsc: { type: String, trim: true },
      pan: { type: String, trim: true },
      aadhaarLast4: { type: String, trim: true },
      baseSalary: { type: Number },
    },
  },
  { timestamps: true },
);

EmployeeSchema.index({ orgId: 1, employeeCode: 1 }, { unique: true });

export const EmployeeModel = model("Employee", EmployeeSchema);
