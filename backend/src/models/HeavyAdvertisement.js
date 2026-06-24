import mongoose from "mongoose";

const heavyAdvertisementSchema = new mongoose.Schema(
  {
    campaignName: { type: String, required: true, trim: true },
    campaignType: {
      type: String,
      required: true,
      enum: ["Billboards", "Sponsorship Deals", "Event Sponsoring", "Outdoor Ads"]
    },
    location: { type: String, required: true, trim: true },
    amountSpent: { type: Number, required: true, min: 0 },
    profitGenerated: { type: Number, required: true, min: 0 },
    reach: { type: Number, required: true, min: 0 },
    roi: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, enum: ["active", "scheduled", "completed"] }
  },
  { timestamps: true }
);

export default mongoose.model("HeavyAdvertisement", heavyAdvertisementSchema);
