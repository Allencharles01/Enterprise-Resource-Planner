import { Router } from "express";
import Project from "dbms/Project.js";
import Task from "dbms/Task.js";

export const projectsRouter = Router();

const CATEGORY_MAP = {
  frontend: "FrontEnd",
  backend: "BackEnd",
  networks: "Network and Security",
  dbms: "Database Management",
  testing: "Testing and QA",
};

// Create a new project
projectsRouter.post("/", async (req, res) => {
  try {
    const { basicDetails, departments } = req.body;
    const projectManager = basicDetails.projectLead
      ? `${basicDetails.projectLead.personal?.firstName || ""} ${basicDetails.projectLead.personal?.lastName || ""}`.trim()
      : "Unassigned";

    const project = new Project({
      name: basicDetails.projectTitle,
      client: basicDetails.clientName,
      clientPhone: basicDetails.clientPhone,
      clientCountryCode: basicDetails.clientCountryCode || "+1",
      clientEmail: basicDetails.clientEmail,
      manager: projectManager,
      budget: basicDetails.budget,
      currency: basicDetails.currency || "USD",
      projectDetails: basicDetails.projectDetails,
      files: basicDetails.files || [],
      deadline: basicDetails.deadline
        ? new Date(basicDetails.deadline)
        : undefined,
      departments: departments,
    });
    await project.save();

    if (departments) {
      for (const [deptKey, deptData] of Object.entries(departments)) {
        const typedDeptData = deptData;
        if (typedDeptData && typedDeptData.teams && Array.isArray(typedDeptData.teams)) {
          for (const team of typedDeptData.teams) {
            if (team.name) {
              const taskManager = team.lead
                ? `${team.lead.personal?.firstName || ""} ${team.lead.personal?.lastName || ""}`.trim()
                : "Unassigned";

              const membersCount = team.members ? team.members.length : 1;
              const taskDeadline =
                typedDeptData.deadline || basicDetails.deadline;

              const task = new Task({
                title: team.name,
                category: CATEGORY_MAP[deptKey] || deptKey,
                manager: taskManager,
                membersCount: membersCount,
                projectId: project._id,
                deadline: taskDeadline ? new Date(taskDeadline) : undefined,
              });
              await task.save();
            }
          }
        }
      }
    }

    res.status(201).json({ success: true, projectId: project._id });
  } catch (error) {
    console.error("Failed to create project:", error);
    res.status(500).json({ error: "Failed to create project and tasks" });
  }
});

// Update an existing project
projectsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { basicDetails, departments, status } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (basicDetails) {
      if (basicDetails.projectTitle) project.name = basicDetails.projectTitle;
      if (basicDetails.clientName !== undefined) project.client = basicDetails.clientName;
      if (basicDetails.clientPhone !== undefined) project.clientPhone = basicDetails.clientPhone;
      if (basicDetails.clientCountryCode !== undefined) project.clientCountryCode = basicDetails.clientCountryCode;
      if (basicDetails.clientEmail !== undefined) project.clientEmail = basicDetails.clientEmail;
      if (basicDetails.budget !== undefined) project.budget = basicDetails.budget;
      if (basicDetails.currency !== undefined) project.currency = basicDetails.currency;
      if (basicDetails.projectDetails !== undefined) project.projectDetails = basicDetails.projectDetails;
      if (basicDetails.files !== undefined) project.files = basicDetails.files;
      if (basicDetails.deadline) project.deadline = new Date(basicDetails.deadline);
      if (basicDetails.projectLead) {
        project.manager = `${basicDetails.projectLead.personal?.firstName || ""} ${basicDetails.projectLead.personal?.lastName || ""}`.trim();
      }
    }

    if (status !== undefined) {
      project.status = status;
    }

    if (departments) {
      project.departments = departments;
      project.markModified("departments");
    }

    await project.save();

    res.json({ success: true, project });
  } catch (error) {
    console.error("Failed to update project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// Delete a project
projectsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    await Task.deleteMany({ projectId: id });
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Failed to delete project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Get all projects
projectsRouter.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    const projectsWithTasks = await Promise.all(
      projects.map(async (p) => {
        const tasksCount = await Task.countDocuments({ projectId: p._id });
        const completedTasksCount = await Task.countDocuments({
          projectId: p._id,
          isComplete: true,
        });
        return {
          ...p.toObject(),
          id: String(p._id),
          remainingTasks: tasksCount - completedTasksCount,
        };
      }),
    );

    res.json(projectsWithTasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Get a single project
projectsRouter.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json({ ...project.toObject(), id: String(project._id) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// Get tasks for a project
projectsRouter.get("/:id/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});
