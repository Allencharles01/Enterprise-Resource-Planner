import mongoose, { Schema } from "mongoose";

const TicketSchema = new Schema(
  {
    ticketID: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["Customer", "Employee"],
      default: "Customer",
    },
    // Customer details
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phoneCountryCode: { type: String, default: "+1" },
    phoneNumber: { type: String, default: "" },
    areaOfInconvenience: { type: String, default: "" },

    // Employee details
    employeeName: { type: String, default: "" },
    employeeId: { type: String, default: "" },
    employeeEmail: { type: String, default: "" },
    moduleName: { type: String, default: "" },
    category: { type: String, default: "" },
    subCategory: { type: String, default: "" },

    // Shared details
    remarks: { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileData: { type: String, default: "" }, // Base64 or string if attached
    status: {
      type: String,
      enum: ["Open", "Ongoing", "Closed"],
      default: "Open",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models?.Ticket || mongoose.model("Ticket", TicketSchema);
