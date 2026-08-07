import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../DBMS/Project.js";

dotenv.config();

const uri = process.env.MONGODB_URI;
console.log("Connecting to:", uri);

async function run() {
  await mongoose.connect(uri);
  console.log("Connected!");

  const projects = await Project.find();
  console.log("=== Projects ===");
  console.log(JSON.stringify(projects, null, 2));

  await mongoose.disconnect();
}

run().catch(console.error);
