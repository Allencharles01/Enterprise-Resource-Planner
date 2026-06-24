import express from "express";
import Document from "../models/Document.js";
import { createActivity } from "../utils/activity.js";
import { emitDashboardUpdated } from "../realtime.js";
import { sortQuery, textRegex } from "../utils/queries.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { documentType, search, from, to, sortBy, order } = req.query;
    const query = {};
    if (documentType) query.documentType = documentType;
    if (search) query.documentName = textRegex(search);
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }
    const documents = await Document.find(query).sort(sortQuery(sortBy || "date", order)).lean();
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const document = await Document.create(req.body);
    await createActivity(`Invoice uploaded: ${document.documentName}`, "document");
    emitDashboardUpdated();
    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (document) await createActivity(`Document removed: ${document.documentName}`, "document");
    emitDashboardUpdated();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
