import express from "express";
import { getMonthlyAnalytics } from "../utils/analytics.js";

const router = express.Router();

router.get("/monthly-spend", async (req, res, next) => {
  try {
    res.json(await getMonthlyAnalytics(req.query.range));
  } catch (error) {
    next(error);
  }
});

export default router;
