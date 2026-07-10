import mongoose, { Schema } from "mongoose";

const CustomerInquirySchema = new Schema(
  {
    name: { type: String, required: true },
    phoneCountryCode: { type: String, default: "+1" },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    altPhoneCountryCode: { type: String, default: "+1" },
    altPhoneNumber: { type: String, default: "" },
    altEmail: { type: String, default: "" },
    projectName: { type: String, required: true },
    projectDetails: { type: String, default: "" },
    budgetRange: { type: String, default: "" },
    currency: { type: String, default: "USD ($)" },
    deadline: { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileData: { type: String, default: "" }, // Base64 or URL if attached
    status: {
      type: String,
      enum: ["active", "contacted", "resolved", "rejected"],
      default: "active",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("CustomerInquiry", CustomerInquirySchema);
