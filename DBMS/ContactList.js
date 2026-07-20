import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const ContactListSchema = new Schema(
  {
    orgId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    fileName: { type: String, required: true },
    headers: [{ type: String }],
    rows: [Schema.Types.Mixed],
    fileData: { type: String }, // Base64 string for PDF/DOCX files
    fileType: { type: String, required: true }, // "csv", "pdf", "document"
    assignedTo: { type: String }, // Target employeeCode
    assignedByName: { type: String }, // Admin who assigned the list
    status: { type: String, default: "pending" }, // "pending", "synced"
  },
  { timestamps: true }
);

export const ContactListModel = models.ContactList || model("ContactList", ContactListSchema);
