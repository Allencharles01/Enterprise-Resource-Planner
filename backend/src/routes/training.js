import { Router } from "express";
import TrainingCandidate from "dbms/TrainingCandidate.js";
import TrainingCourse from "dbms/TrainingCourse.js";
import Notification from "dbms/Notification.js";
import { EmployeeModel } from "dbms/Employee.js";

export const trainingRouter = Router();

async function createAssignmentNotification(salesAgent, type, candidateId) {
  if (!salesAgent) return;
  try {
    const employees = await EmployeeModel.find();
    const emp = employees.find(e => {
      const fullName = `${e.personal?.firstName || ""} ${e.personal?.lastName || ""}`.trim().toLowerCase();
      return fullName === salesAgent.trim().toLowerCase();
    });

    const empCode = emp ? emp.employeeCode : "EMP001";
    const msg = type === "Training"
      ? "Admin has assigned a Training candidate to you."
      : "Admin has assigned a Training candidate to you.";

    await Notification.create({
      title: `${type} Candidate Assigned`,
      message: msg,
      category: "message",
      isRead: false,
      metadata: {
        employeeCode: empCode,
        employeeName: salesAgent,
        refId: String(candidateId),
        refType: type === "Training" ? "TrainingCandidate" : "TrainingCandidate"
      }
    });
  } catch (e) {
    console.error("Failed to create assignment notification:", e);
  }
}

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
    if (candidate.salesAgent) {
      await createAssignmentNotification(candidate.salesAgent, "Training", candidate._id);
    }
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create training candidate" });
  }
});

// Update candidate
trainingRouter.put("/candidates/:id", async (req, res) => {
  try {
    const original = await TrainingCandidate.findById(req.params.id);
    const updated = await TrainingCandidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Training candidate not found" });
    }
    if (updated.salesAgent && (!original || original.salesAgent !== updated.salesAgent)) {
      await createAssignmentNotification(updated.salesAgent, "Training", updated._id);
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
