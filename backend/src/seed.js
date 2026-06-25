<<<<<<< HEAD
import dotenv from "dotenv";
import { pathToFileURL } from "url";
import { connectDatabase } from "./db.js";
import AdvertisingCampaign from "./models/AdvertisingCampaign.js";
import ContentCreator from "./models/ContentCreator.js";
import HeavyAdvertisement from "./models/HeavyAdvertisement.js";
import Document from "./models/Document.js";
import Activity from "./models/Activity.js";

dotenv.config();

export async function ensureCollections() {
  await Promise.all([
    AdvertisingCampaign.createCollection(),
    ContentCreator.createCollection(),
    HeavyAdvertisement.createCollection(),
    Document.createCollection(),
    Activity.createCollection()
  ]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await connectDatabase();
  await ensureCollections();
  console.log("MongoDB collections are ready.");
  process.exit(0);
}
=======
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { OrganizationModel } from "dbms/Organization.js";
import { UserModel } from "dbms/User.js";
import { EmployeeModel } from "dbms/Employee.js";
import { env } from "./lib/env.js";

async function seed() {
  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const orgName = "Novanectar";
    const orgSlug = "novanectar";

    let org = await OrganizationModel.findOne({ slug: orgSlug });
    if (!org) {
      console.log(`Creating organization ${orgName}...`);
      org = await OrganizationModel.create({ name: orgName, slug: orgSlug });
    }

    const employeeCode = "ALLCHAR";
    const name = "Allen Charles";
    const loginId = "Allchar";
    const password = "admin123_";

    let employee = await EmployeeModel.findOne({
      orgId: org._id,
      employeeCode,
    });
    if (!employee) {
      console.log(`Creating employee ${name}...`);
      employee = await EmployeeModel.create({
        orgId: org._id,
        employeeCode,
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
    }

    let user = await UserModel.findOne({
      orgId: org._id,
      email: loginId.toLowerCase(),
    });
    if (!user) {
      console.log(`Creating user with Login ID ${loginId}...`);
      const passwordHash = await bcrypt.hash(password, 12);
      user = await UserModel.create({
        orgId: org._id,
        name: name,
        email: loginId.toLowerCase(), // Store Login ID in email field
        passwordHash,
        role: "org_admin",
      });
      // Link user to employee
      employee.userId = user._id;
      await employee.save();
    } else {
      console.log(
        `User with Login ID ${loginId} already exists. Updating password...`,
      );
      user.passwordHash = await bcrypt.hash(password, 12);
      user.role = "org_admin";
      await user.save();
    }

    console.log("Seed completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
>>>>>>> 24ea7a44f9cd1f7fec147b566fc4de1f6a4960d0
