import bcrypt from "bcryptjs";
import { env } from "../lib/env.js";
import { connectMongo } from "../lib/mongo.js";
import { OrganizationModel } from "dbms/Organization.js";
import { UserModel } from "dbms/User.js";
import { EmployeeModel } from "dbms/Employee.js";

function option(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error(
    "Usage: npm run create-superadmin -- --name <name> --login <id> --password <password> [--org-name <name>] [--org-slug novanectar]",
  );
  process.exit(1);
}

const name = option("name");
const login = option("login")?.trim().toLowerCase();
const password = option("password");
const orgName = option("org-name") || "NovaNectar ERP";
const orgSlug = option("org-slug") || "novanectar";

if (!name || !login || !password) usage("name, login, and password are required.");
if (password.length < 8) usage("password must be at least 8 characters.");

async function run() {
  await connectMongo(env.MONGODB_URI);

  let organization = await OrganizationModel.findOne({ slug: orgSlug });
  if (!organization) {
    organization = await OrganizationModel.create({ name: orgName, slug: orgSlug });
    console.log(`Created organization: ${orgSlug}`);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  let user = await UserModel.findOne({ orgId: organization._id, email: login });
  if (!user) {
    user = await UserModel.create({
      orgId: organization._id,
      name,
      email: login,
      passwordHash,
      role: "super_admin",
      isActive: true,
    });
    console.log(`Created super-admin: ${login}`);
  } else {
    user.name = name;
    user.passwordHash = passwordHash;
    user.role = "super_admin";
    user.isActive = true;
    await user.save();
    console.log(`Updated super-admin: ${login}`);
  }

  const [firstName, ...lastName] = name.trim().split(/\s+/);
  const employeeCode = login.toUpperCase();
  const employee = await EmployeeModel.findOne({
    orgId: organization._id,
    employeeCode,
  });
  const employeeData = {
    userId: user._id,
    personal: { firstName, lastName: lastName.join(" "), contactEmail: login },
    work: {
      department: "Administration",
      designation: "Super Administrator",
      status: "active",
    },
  };

  if (employee) {
    Object.assign(employee, employeeData);
    await employee.save();
  } else {
    await EmployeeModel.create({
      orgId: organization._id,
      employeeCode,
      ...employeeData,
    });
  }

  console.log("Super-admin is ready. Sign in through the Admin Login tab.");
}

run()
  .catch((error) => {
    console.error("Could not create super-admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = (await import("mongoose")).default;
    await mongoose.disconnect();
  });
