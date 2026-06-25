import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment variables");
  process.exit(1);
}

// Schemas & Models
const OrgSchema = new mongoose.Schema({
  name: String,
  slug: String,
});

const UserSchema = new mongoose.Schema({
  orgId: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  role: String,
  isActive: Boolean,
});

const EmployeeSchema = new mongoose.Schema({
  orgId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  employeeCode: String,
  employeeNumber: String,
  personal: {
    firstName: String,
    lastName: String,
    contactEmail: String,
  },
  work: {
    department: String,
    designation: String,
    companyEmail: String,
    manager: String,
    status: String,
  },
});

const OrgModel =
  mongoose.models.Organization || mongoose.model("Organization", OrgSchema);
const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
const EmployeeModel =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
const ProjectModel =
  mongoose.models.Project ||
  mongoose.model("Project", new mongoose.Schema({}, { strict: false }));
const TaskModel =
  mongoose.models.Task ||
  mongoose.model("Task", new mongoose.Schema({}, { strict: false }));
const AccountRequestModel =
  mongoose.models.AccountRequest ||
  mongoose.model("AccountRequest", new mongoose.Schema({}, { strict: false }));

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");

    console.log("Dropping collections...");
    await Promise.all([
      OrgModel.deleteMany({}),
      UserModel.deleteMany({}),
      EmployeeModel.deleteMany({}),
      ProjectModel.deleteMany({}),
      TaskModel.deleteMany({}),
      AccountRequestModel.deleteMany({}),
    ]);
    console.log("All collections cleared.");

    console.log("Seeding data...");

    const org = await OrgModel.create({
      name: "NovaNectar",
      slug: "novanectar",
    });

    const passwordHash = await bcrypt.hash("admin123_", 12);

    const user = await UserModel.create({
      orgId: org._id,
      name: "Allen Charles",
      email: "allchar", // Using login ID as email, stored lowercase to match login logic
      passwordHash,
      role: "super_admin",
      isActive: true,
    });

    await EmployeeModel.create({
      orgId: org._id,
      userId: user._id,
      employeeCode: "AllChar",
      employeeNumber: "002",
      personal: {
        firstName: "Allen",
        lastName: "Charles",
        contactEmail: "primecharles3@gmail.com",
      },
      work: {
        department: "Backend",
        designation: "Project Lead",
        companyEmail: "Allchar@novanectar.com",
        manager: "Avneesh",
        status: "active",
      },
    });

    console.log("Seeding completed successfully.");
    console.log("Login: Allchar");
    console.log("Password: admin123_");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
