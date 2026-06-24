import express from "express";
import ContentCreator from "../models/ContentCreator.js";
import { createActivity } from "../utils/activity.js";
import { emitDashboardUpdated } from "../realtime.js";
import { sortQuery, textRegex } from "../utils/queries.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { platform, creatorType, search, sortBy, order } = req.query;
    const query = {};
    if (platform) query.platform = platform;
    if (creatorType) query.creatorType = creatorType;
    if (search) query.creatorName = textRegex(search);
    const creators = await ContentCreator.find(query).sort(sortQuery(sortBy, order)).lean();
    res.json(creators);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const creator = await ContentCreator.create(req.body);
    await createActivity(`Creator added: ${creator.creatorName}`, creator.creatorType === "partnership" ? "partnership" : "creator");
    emitDashboardUpdated();
    res.status(201).json(creator);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const creator = await ContentCreator.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await createActivity(`Creator updated: ${creator.creatorName}`, "creator");
    emitDashboardUpdated();
    res.json(creator);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const creator = await ContentCreator.findByIdAndDelete(req.params.id);
    if (creator) await createActivity(`Creator removed: ${creator.creatorName}`, "creator");
    emitDashboardUpdated();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
