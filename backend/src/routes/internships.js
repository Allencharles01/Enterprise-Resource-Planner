import { Router } from "express";
import InternshipCandidate from "dbms/InternshipCandidate.js";
import InternshipCourse from "dbms/InternshipCourse.js";
import Notification from "dbms/Notification.js";
import { EmployeeModel } from "dbms/Employee.js";

export const internshipsRouter = Router();

async function createAssignmentNotification(salesAgent, type, candidateId) {
  if (!salesAgent) return;
  try {
    const employees = await EmployeeModel.find();
    const emp = employees.find(e => {
      const fullName = `${e.personal?.firstName || ""} ${e.personal?.lastName || ""}`.trim().toLowerCase();
      return fullName === salesAgent.trim().toLowerCase();
    });

    const empCode = emp ? emp.employeeCode : "EMP001";
    const msg = type === "Internship"
      ? "Admin has assigned an Internship candidate to you."
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
        refType: type === "Internship" ? "InternshipCandidate" : "TrainingCandidate"
      }
    });
  } catch (e) {
    console.error("Failed to create assignment notification:", e);
  }
}

// --- CANDIDATES CRUD ---

// Get all candidates
internshipsRouter.get("/candidates", async (req, res) => {
  try {
    const candidates = await InternshipCandidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
});

// Create candidate
internshipsRouter.post("/candidates", async (req, res) => {
  try {
    const candidate = new InternshipCandidate(req.body);
    await candidate.save();
    if (candidate.salesAgent) {
      await createAssignmentNotification(candidate.salesAgent, "Internship", candidate._id);
    }
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create candidate" });
  }
});

// Update candidate
internshipsRouter.put("/candidates/:id", async (req, res) => {
  try {
    const original = await InternshipCandidate.findById(req.params.id);
    const updated = await InternshipCandidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    if (updated.salesAgent && (!original || original.salesAgent !== updated.salesAgent)) {
      await createAssignmentNotification(updated.salesAgent, "Internship", updated._id);
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update candidate" });
  }
});

// Delete candidate
internshipsRouter.delete("/candidates/:id", async (req, res) => {
  try {
    const deleted = await InternshipCandidate.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.json({ success: true, deletedId: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete candidate" });
  }
});

// --- COURSES CRUD ---

// Get all courses
internshipsRouter.get("/courses", async (req, res) => {
  try {
    const courses = await InternshipCourse.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// Create course
internshipsRouter.post("/courses", async (req, res) => {
  try {
    const course = new InternshipCourse(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create course" });
  }
});

// Update course
internshipsRouter.put("/courses/:id", async (req, res) => {
  try {
    const updated = await InternshipCourse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update course" });
  }
});

// Delete course
internshipsRouter.delete("/courses/:id", async (req, res) => {
  try {
    const deleted = await InternshipCourse.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ success: true, deletedId: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete course" });
  }
});
