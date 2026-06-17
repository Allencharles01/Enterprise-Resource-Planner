import bcrypt from "bcryptjs";
import { env } from "../lib/env.js";
import { connectMongo } from "../lib/mongo.js";
import { UserModel } from "dbms/User.js";
import { EmployeeModel } from "dbms/Employee.js";
import { OrganizationModel } from "dbms/Organization.js";
import Project from "dbms/Project.js";
import Task from "dbms/Task.js";

async function run() {
  try {
    await connectMongo(env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // 1. Clear projects and tasks
    console.log("Clearing projects and tasks...");
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log("Projects and tasks cleared.");

    // 2. Ensure organization exists
    let org = await OrganizationModel.findOne({ slug: "novanectar" });
    if (!org) {
      org = await OrganizationModel.create({
        name: "NovaNectar ERP",
        slug: "novanectar",
      });
      console.log("Created Organization: novanectar");
    }

    // 3. Create or update Master Admin user
    const email = "allchar";
    const password = "admin123_";
    const passwordHash = await bcrypt.hash(password, 12);

    let user = await UserModel.findOne({ orgId: org._id, email });
    if (!user) {
      user = await UserModel.create({
        orgId: org._id,
        name: "Allen Charles",
        email,
        passwordHash,
        role: "super_admin",
        isActive: true,
      });
      console.log("Created Master Admin user");
    } else {
      user.name = "Allen Charles";
      user.passwordHash = passwordHash;
      user.role = "super_admin";
      await user.save();
      console.log("Updated existing Master Admin user");
    }

    // 4. Create or update Employee profile
    let employee = await EmployeeModel.findOne({
      orgId: org._id,
      employeeCode: "Allchar",
    });
    if (!employee) {
      await EmployeeModel.create({
        orgId: org._id,
        userId: user._id,
        employeeCode: "Allchar",
        personal: {
          firstName: "Allen",
          lastName: "Charles",
        },
        work: {
          department: "Backend",
          designation: "Lead Manager",
          status: "active",
        },
      });
      console.log("Created Employee profile for Master Admin");
    } else {
      employee.userId = user._id;
      employee.personal = { firstName: "Allen", lastName: "Charles" };
      employee.work = {
        department: "Backend",
        designation: "Lead Manager",
        status: "active",
      };
      await employee.save();
      console.log("Updated existing Employee profile");
    }

    console.log("Done!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

run();
