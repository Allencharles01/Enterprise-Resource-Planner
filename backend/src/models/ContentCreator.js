import mongoose from "mongoose";

const contentCreatorSchema = new mongoose.Schema(
  {
    creatorName: {
      type: String,
      required: true,
      enum: ["CarryMinati", "MrBeast", "BeerBiceps", "Logan Paul"]
    },
    platform: {
      type: String,
      required: true,
      enum: ["Instagram", "YouTube", "TikTok", "Facebook", "X"]
    },
    creatorType: { type: String, required: true, enum: ["oneTime", "partnership"] },
    amountSpent: { type: Number, required: true, min: 0 },
    revenueShare: { type: Number, required: true, min: 0 },
    profitGenerated: { type: Number, required: true, min: 0 },
    reach: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, enum: ["active", "negotiating", "completed"] }
  },
  { timestamps: true }
);

export default mongoose.model("ContentCreator", contentCreatorSchema);
