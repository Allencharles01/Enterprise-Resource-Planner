import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    documentName: { type: String, required: true, trim: true },
    documentType: {
      type: String,
      required: true,
      enum: ["Invoices", "Contracts", "Payment Records", "Partnership Agreements"]
    },
    relatedTo: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    status: { type: String, required: true, enum: ["pending", "approved", "paid", "signed"] },
    fileUrl: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
