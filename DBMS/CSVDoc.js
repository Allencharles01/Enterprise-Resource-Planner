import mongoose from "mongoose";

// Switch mongoose connection to use 'CSV_Docs' database
const csvDocsDb = mongoose.connection.useDb("CSV_Docs");

const CSVDocSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["file", "directory"] },
    path: { type: String, required: true }, // e.g., "Main Uploads/2026/Jul/TestData.csv"
    headers: [String],
    rows: [mongoose.Schema.Types.Mixed],
    fileType: { type: String, default: "csv" },
    uploadedBy: String,
    assignedTo: String,
  },
  { timestamps: true }
);

export const CSVDocModel = csvDocsDb.model("CSVDoc", CSVDocSchema);
