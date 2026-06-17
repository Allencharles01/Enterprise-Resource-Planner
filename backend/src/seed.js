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
