import mongoose, { Schema } from "mongoose";

const InternalChatSchema = new Schema(
  {
    senderId: { type: String, required: true }, // userId or employeeCode
    senderName: { type: String, required: true },
    senderCode: { type: String, default: "" }, // EMP ID or Admin ID
    senderRole: { type: String, default: "employee" }, // "admin" or "employee" or designation
    recipientId: { type: String, required: true }, // userId or employeeCode
    recipientName: { type: String, required: true },
    recipientCode: { type: String, default: "" },
    recipientRole: { type: String, default: "" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("InternalChat", InternalChatSchema);
