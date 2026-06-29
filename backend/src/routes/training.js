import { Router } from "express";
import TrainingCandidate from "dbms/TrainingCandidate.js";
import TrainingCourse from "dbms/TrainingCourse.js";

export const trainingRouter = Router();

// --- CANDIDATES CRUD ---

// Get all candidates
trainingRouter.get("/candidates", async (req, res) => {
  try {
    const candidates = await TrainingCandidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch training candidates" });
  }
});

// Create candidate
trainingRouter.post("/candidates", async (req, res) => {
  try {
    const candidate = new TrainingCandidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create training candidate" });
  }
});

// Update candidate
trainingRouter.put("/candidates/:id", async (req, res) => {
  try {
    const updated = await TrainingCandidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Training candidate not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update training candidate" });
  }
});

// Delete candidate
trainingRouter.delete("/candidates/:id", async (req, res) => {
  try {
    const deleted = await TrainingCandidate.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Training candidate not found" });
    }
    res.json({ success: true, deletedId: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete training candidate" });
  }
});

// --- COURSES CRUD ---

// Get all courses
trainingRouter.get("/courses", async (req, res) => {
  try {
    const courses = await TrainingCourse.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch training courses" });
  }
});

// Create course
trainingRouter.post("/courses", async (req, res) => {
  try {
    const course = new TrainingCourse(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create training course" });
  }
});

// Update course
trainingRouter.put("/courses/:id", async (req, res) => {
  try {
    const updated = await TrainingCourse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Training course not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update training course" });
  }
});

// Delete course
trainingRouter.delete("/courses/:id", async (req, res) => {
  try {
    const deleted = await TrainingCourse.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Training course not found" });
    }
    res.json({ success: true, deletedId: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete training course" });
  }
});
