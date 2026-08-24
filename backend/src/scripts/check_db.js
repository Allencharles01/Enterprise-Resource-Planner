import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");

    const Project = mongoose.connection.collection("projects");
    const Employee = mongoose.connection.collection("employees");
    const User = mongoose.connection.collection("users");
    const Task = mongoose.connection.collection("tasks");

    const projectCount = await Project.countDocuments();
    const employeeCount = await Employee.countDocuments();
    const userCount = await User.countDocuments();
    const taskCount = await Task.countDocuments();

    console.log(`Projects: ${projectCount}`);
    console.log(`Employees: ${employeeCount}`);
    console.log(`Users: ${userCount}`);
    console.log(`Tasks: ${taskCount}`);

    const projects = await Project.find({}).toArray();
    console.log("All Projects:");
    projects.forEach(p => console.log(`- ${p.name} (Client: ${p.client})`));

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

check();
