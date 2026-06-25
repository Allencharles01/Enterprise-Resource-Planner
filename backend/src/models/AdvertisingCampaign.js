import mongoose from "mongoose";

const advertisingCampaignSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ["Google Ads", "Meta Ads", "Instagram Ads", "Facebook Ads", "X Ads"]
    },
    campaignName: { type: String, required: true, trim: true },
    amountSpent: { type: Number, required: true, min: 0 },
    profitGenerated: { type: Number, required: true, min: 0 },
    reach: { type: Number, required: true, min: 0 },
    roi: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, enum: ["active", "paused", "completed"] }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default mongoose.model("AdvertisingCampaign", advertisingCampaignSchema);
