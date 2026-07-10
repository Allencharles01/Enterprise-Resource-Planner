import mongoose, { Schema } from "mongoose";

const ProfileChangeRequestSchema = new Schema(
  {
    employeeId: { type: String, required: true }, // _id or employeeCode of the employee
    employeeCode: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    currentData: {
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      employeeCode: { type: String, default: "" },
      companyEmail: { type: String, default: "" },
      contactEmail: { type: String, default: "" },
      manager: { type: String, default: "" },
      designation: { type: String, default: "" },
      department: { type: String, default: "" },
    },
    requestedData: {
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      employeeCode: { type: String, default: "" },
      companyEmail: { type: String, default: "" },
      contactEmail: { type: String, default: "" },
      manager: { type: String, default: "" },
      designation: { type: String, default: "" },
      department: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isRead: { type: Boolean, default: false },
    reason: { type: String, default: "" },
    adminRemarks: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("ProfileChangeRequest", ProfileChangeRequestSchema);
