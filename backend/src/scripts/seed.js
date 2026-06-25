import mongoose from "mongoose";
import * as dotenv from "dotenv";
import Project from "dbms/Project.js";
import Task from "dbms/Task.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/erp";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Clear existing data to avoid duplicates on multiple runs
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log("Cleared existing projects and tasks.");

    const erpProject = new Project({
      name: "ERP",
      client: "NovaNectar Services Pvt Ltd",
      manager: "Allen Charles",
      status: "Ongoing",
    });

    await erpProject.save();
    console.log(`Created Project: ${erpProject.name}`);

    const tasks = [
      {
        title: "Creating a Login Page Interface",
        category: "FrontEnd",
        manager: "Allen Charles",
        membersCount: 2,
        isComplete: true, // Let's make some complete, some incomplete
        projectId: erpProject._id,
      },
      {
        title: "Create a Admin Dashboard",
        category: "FrontEnd",
        manager: "Allen Charles",
        membersCount: 3,
        isComplete: false,
        projectId: erpProject._id,
      },
      {
        title: "Creating a Login Page API",
        category: "BackEnd",
        manager: "Allen Charles",
        membersCount: 2,
        isComplete: true,
        projectId: erpProject._id,
      },
      {
        title: "Create a Admin Dashboard API",
        category: "BackEnd",
        manager: "Allen Charles",
        membersCount: 3,
        isComplete: false,
        projectId: erpProject._id,
      },
      {
        title:
          "Create a Pathway to enter the project details Via MongoDB Atlas",
        category: "Database Management",
        manager: "Allen Charles",
        membersCount: 1,
        isComplete: true,
        projectId: erpProject._id,
      },
    ];

    await Task.insertMany(tasks);
    console.log(
      `Created ${tasks.length} tasks for Project: ${erpProject.name}`,
    );

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
