import mongoose, { Schema } from "mongoose";

const EmailLogSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["email", "message"],
      default: "email",
    },
    direction: {
      type: String,
      enum: ["outbound", "inbound"],
      default: "outbound",
    },
    to: { type: String, required: true },
    from: { type: String, default: "NovaNectar ERP <onboarding@resend.dev>" },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    attachments: [
      {
        name: { type: String },
        data: { type: String }, // Base64 or URL
      },
    ],
    relatedInquiryId: {
      type: Schema.Types.ObjectId,
      ref: "CustomerInquiry",
      default: null,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("EmailLog", EmailLogSchema);
