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
      ? `${basicDetails.projectLead.personal.firstName} ${basicDetails.projectLead.personal.lastName || ""}`.trim()
      : "Unassigned";

    const project = new Project({
      name: basicDetails.projectTitle,
      client: basicDetails.clientName,
      manager: projectManager,
      deadline: basicDetails.deadline
        ? new Date(basicDetails.deadline)
        : undefined,
      departments: departments,
    });
    await project.save();

    if (departments) {
      for (const [deptKey, deptData] of Object.entries(departments)) {
        const typedDeptData = deptData;
        if (typedDeptData.teams && Array.isArray(typedDeptData.teams)) {
          for (const team of typedDeptData.teams) {
            if (team.name) {
              const taskManager = team.lead
                ? `${team.lead.personal.firstName} ${team.lead.personal.lastName || ""}`.trim()
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

// Get all projects
projectsRouter.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    // Attach task count or remaining tasks to projects if needed
    const projectsWithTasks = await Promise.all(
      projects.map(async (p) => {
        const tasksCount = await Task.countDocuments({ projectId: p._id });
        const completedTasksCount = await Task.countDocuments({
          projectId: p._id,
          isComplete: true,
        });
        return {
          ...p.toObject(),
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
    res.json(project);
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
