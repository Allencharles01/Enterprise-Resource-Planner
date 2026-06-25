import express from "express";
import HeavyAdvertisement from "../models/HeavyAdvertisement.js";
import { createActivity } from "../utils/activity.js";
import { emitDashboardUpdated } from "../realtime.js";
import { sortQuery, textRegex } from "../utils/queries.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { campaignType, search, sortBy, order } = req.query;
    const query = {};
    if (campaignType) query.campaignType = campaignType;
    if (search) query.campaignName = textRegex(search);
    const campaigns = await HeavyAdvertisement.find(query).sort(sortQuery(sortBy, order)).lean();
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const campaign = await HeavyAdvertisement.create(req.body);
    await createActivity(`Heavy advertisement created: ${campaign.campaignName}`, "heavyAd");
    emitDashboardUpdated();
    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const campaign = await HeavyAdvertisement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await createActivity(`Heavy advertisement updated: ${campaign.campaignName}`, "heavyAd");
    emitDashboardUpdated();
    res.json(campaign);
  } catch (error) {
    next(error);
  }
});

export default router;
