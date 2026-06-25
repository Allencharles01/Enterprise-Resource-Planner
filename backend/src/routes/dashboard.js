import express from "express";
import Activity from "../models/Activity.js";
import { getDashboardSummary } from "../utils/analytics.js";

const router = express.Router();

router.get("/dashboard-summary", async (req, res, next) => {
  try {
    res.json(await getDashboardSummary());
  } catch (error) {
    next(error);
  }
});

router.get("/activities", async (req, res, next) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 }).limit(20).lean();
    res.json(activities);
  } catch (error) {
    next(error);
  }
});

export default router;
