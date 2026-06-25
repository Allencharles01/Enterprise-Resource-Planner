import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    message: { type: String, required: true, trim: true },
    timestamp: { type: Date, required: true, default: Date.now },
    type: { type: String, required: true, enum: ["campaign", "creator", "document", "partnership", "heavyAd"] }
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
