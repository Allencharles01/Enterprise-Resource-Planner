import mongoose, { Schema } from "mongoose";

const TrainingCandidateSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    education: { type: String },
    university: { type: String },
    courseName: { type: String, required: true },
    duration: { type: String },
    cost: { type: String },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Bank Transfer"],
      default: "Bank Transfer",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    salesAgent: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Dropped Out", "Completed"],
      default: "Active",
    },
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.TrainingCandidate ||
  mongoose.model("TrainingCandidate", TrainingCandidateSchema);
