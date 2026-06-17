import bcrypt from "bcryptjs";
import { env } from "../lib/env.js";
import { connectMongo } from "../lib/mongo.js";
import { UserModel } from "dbms/User.js";
import { EmployeeModel } from "dbms/Employee.js";
import { OrganizationModel } from "dbms/Organization.js";

async function run() {
  try {
    await connectMongo(env.MONGODB_URI);
    console.log("Connected to MongoDB");

    let org = await OrganizationModel.findOne({ slug: "novanectar" });
    if (!org) {
      org = await OrganizationModel.create({
        name: "NovaNectar ERP",
        slug: "novanectar",
      });
      console.log("Created Organization: novanectar");
    }

    // Clear existing "Allen Charles" users and employees to clean up duplicates
    await UserModel.deleteMany({ name: "Allen Charles" });
    await EmployeeModel.deleteMany({
      "personal.firstName": "Allen",
      "personal.lastName": "Charles",
    });

    // Create the fresh requested user
    const email = "allchar";
    const password = "admin123_";
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await UserModel.create({
      orgId: org._id,
      name: "Allen Charles",
      email,
      passwordHash,
      role: "super_admin",
      isActive: true,
    });
    console.log("Created Master Admin user");

    await EmployeeModel.create({
      orgId: org._id,
      userId: user._id,
      employeeCode: "Allchar",
      personal: {
        firstName: "Allen",
        lastName: "Charles",
        contactEmail: "primecharles3@gmail.com",
      },
      work: {
        department: "Backend",
        designation: "Lead Manager",
        companyEmail: "Allchar@novanectar.com",
        manager: "N/A",
        status: "active",
      },
    });
    console.log("Created Employee profile for Master Admin with all details");

    console.log("Done!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

run();
