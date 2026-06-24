import express from "express";
import AdvertisingCampaign from "../models/AdvertisingCampaign.js";
import ContentCreator from "../models/ContentCreator.js";
import HeavyAdvertisement from "../models/HeavyAdvertisement.js";
import Document from "../models/Document.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const [advertisingPlatforms, creatorPlatforms, creatorTypes, campaignTypes, documentTypes] = await Promise.all([
      AdvertisingCampaign.distinct("platform"),
      ContentCreator.distinct("platform"),
      ContentCreator.distinct("creatorType"),
      HeavyAdvertisement.distinct("campaignType"),
      Document.distinct("documentType")
    ]);

    res.json({
      advertisingPlatforms,
      creatorPlatforms,
      creatorTypes,
      campaignTypes,
      documentTypes,
      chartRanges: ["weekly", "monthly", "yearly"]
    });
  } catch (error) {
    next(error);
  }
});

export default router;
