import express from "express";
import AdvertisingCampaign from "../models/AdvertisingCampaign.js";
import { createActivity } from "../utils/activity.js";
import { emitDashboardUpdated } from "../realtime.js";
import { sortQuery, textRegex } from "../utils/queries.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { platform, search, sortBy, order } = req.query;
    const query = {};
    if (platform) query.platform = platform;
    if (search) query.campaignName = textRegex(search);
    const campaigns = await AdvertisingCampaign.find(query).sort(sortQuery(sortBy, order)).lean();
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const campaign = await AdvertisingCampaign.create(req.body);
    await createActivity(`Campaign launched: ${campaign.campaignName}`, "campaign");
    emitDashboardUpdated();
    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const campaign = await AdvertisingCampaign.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await createActivity(`Campaign updated: ${campaign.campaignName}`, "campaign");
    emitDashboardUpdated();
    res.json(campaign);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const campaign = await AdvertisingCampaign.findByIdAndDelete(req.params.id);
    if (campaign) await createActivity(`Campaign removed: ${campaign.campaignName}`, "campaign");
    emitDashboardUpdated();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
