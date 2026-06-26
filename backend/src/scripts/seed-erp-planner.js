import dotenv from "dotenv";
import mongoose from "mongoose";
import Project from "../../../DBMS/Project.js";
import Task from "../../../DBMS/Task.js";
import { EmployeeModel } from "../../../DBMS/Employee.js";

import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "backend/.env") });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/erp";

const CATEGORY_MAP = {
  frontend: "FrontEnd",
  backend: "BackEnd",
  networks: "Network and Security",
  dbms: "Database Management",
  testing: "Testing and QA",
};

const DEPT_DB_MAP = {
  frontend: "Frontend",
  backend: "Backend",
  dbms: "Database Management",
  networks: "Network and Security",
  testing: "Testing and QA",
};

async function seedPlannerProject() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding ERP Planner...");

    // Remove existing test project with same title
    const existing = await Project.findOne({ name: "Enterprise Resource Planner" });
    if (existing) {
      await Task.deleteMany({ projectId: existing._id });
      await Project.findByIdAndDelete(existing._id);
      console.log("Cleaned up previous instance of Enterprise Resource Planner.");
    }

    const leadManager = "Allen Charles";

    const departments = {};

    for (const [deptKey, dbDeptName] of Object.entries(DEPT_DB_MAP)) {
      const emps = await EmployeeModel.find({ "work.department": dbDeptName }).limit(15);
      
      // Fallback if not enough emps found
      const getEmp = (idx) => {
        const e = emps[idx] || emps[0];
        if (e) {
          return {
            id: e._id ? e._id.toString() : `emp_${deptKey}_${idx}`,
            employee: e,
            personal: e.personal,
            employeeNumber: e.employeeNumber,
            designation: e.work?.designation || "Engineer",
          };
        }
        return {
          id: `emp_${deptKey}_${idx}`,
          personal: { firstName: `${deptKey}`, lastName: `Engineer ${idx}` },
          employeeNumber: `EMP_${idx}`,
          designation: "Engineer",
        };
      };

      const mgr = getEmp(0);
      const team1Lead = getEmp(1);
      const team1Members = [2, 3, 4, 5, 6].map((i) => getEmp(i));
      const team2Lead = getEmp(7);
      const team2Members = [8, 9, 10, 11, 12].map((i) => getEmp(i));

      departments[deptKey] = {
        deadline: "2026-07-31",
        reportingManager: {
          personal: mgr.personal,
          employeeNumber: mgr.employeeNumber,
          designation: `${dbDeptName} Manager`,
        },
        teams: [
          {
            id: `t_${deptKey}_1`,
            name: deptKey === "frontend" ? "Dashboard Architecture & Executive Suite UI" :
                  deptKey === "backend" ? "REST API CRUD & Authentication Middleware" :
                  deptKey === "dbms" ? "Schema Optimization & Compound Indexing" :
                  deptKey === "networks" ? "HTTPS Penetration Testing & JWT Auditing" : "Automated Integration Suites & API Mocking",
            lead: { personal: team1Lead.personal },
            isComplete: true,
            members: team1Members,
          },
          {
            id: `t_${deptKey}_2`,
            name: deptKey === "frontend" ? "Responsive Glassmorphism & Modal Interfaces" :
                  deptKey === "backend" ? "Cascading Deletions & Mongoose Sync" :
                  deptKey === "dbms" ? "Atlas Cloud Clustering & Backup Protocols" :
                  deptKey === "networks" ? "Firewall Configuration & DDoS Mitigation" : "User Acceptance Testing & Performance Benchmarking",
            lead: { personal: team2Lead.personal },
            isComplete: false,
            members: team2Members,
          },
        ],
      };
    }

    const projectDoc = new Project({
      name: "Enterprise Resource Planner",
      client: "NovaNectar Pvt Ltd",
      clientPhone: "+91 9876543210",
      clientCountryCode: "+91",
      clientEmail: "internship@novanectar.co.in",
      manager: leadManager,
      budget: "25,000",
      currency: "INR (₹)",
      deadline: new Date("2026-07-31"),
      projectDetails:
        "Comprehensive Next-Gen Enterprise Resource Planning (ERP) suite with AI-powered analytics, automated HR management, international employee payroll seeding, and centralized executive control panels.",
      departments: departments,
    });

    await projectDoc.save();
    console.log(`Created Project: "${projectDoc.name}" (${projectDoc._id})`);

    // Create tasks
    let taskCount = 0;
    for (const [deptKey, deptData] of Object.entries(departments)) {
      for (const team of deptData.teams) {
        const taskManager = team.lead
          ? `${team.lead.personal.firstName} ${team.lead.personal.lastName || ""}`.trim()
          : "Unassigned";

        const task = new Task({
          title: team.name,
          category: CATEGORY_MAP[deptKey] || deptKey,
          manager: taskManager,
          membersCount: team.members.length,
          isComplete: team.isComplete,
          projectId: projectDoc._id,
          deadline: new Date("2026-07-31"),
        });
        await task.save();
        taskCount++;
      }
    }

    console.log(`Successfully seeded ${taskCount} tasks with real employee names from directory!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed project:", err);
    process.exit(1);
  }
}

seedPlannerProject();
