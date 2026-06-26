import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { OrganizationModel } from "dbms/Organization.js";
import { UserModel } from "dbms/User.js";
import { EmployeeModel } from "dbms/Employee.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/erp";

const SUPER_ADMINS = [
  {
    sno: "001",
    empNumber: "001",
    empId: "Allchar",
    name: "Allen Charles",
    firstName: "Allen",
    lastName: "Charles",
    contactEmail: "primecharles3@gmail.com",
    companyEmail: "NA",
    designation: "Project Lead",
    department: "Backend",
    manager: "Avneesh",
    password: "admin123_",
  },
  {
    sno: "002",
    empNumber: "002",
    empId: "EktaCha",
    name: "Ekta Chaudhary",
    firstName: "Ekta",
    lastName: "Chaudhary",
    contactEmail: "chaudharyekta79@gmail.com",
    companyEmail: "NA",
    designation: "Frontend Developer",
    department: "Frontend",
    manager: "Shivanshu",
    password: "Ekta123_",
  },
  {
    sno: "003",
    empNumber: "003",
    empId: "KanakMe",
    name: "Kanak Mehta",
    firstName: "Kanak",
    lastName: "Mehta",
    contactEmail: "kanakmehta070@gmail.com",
    companyEmail: "NA",
    designation: "Frontend Developer",
    department: "Frontend",
    manager: "Shivanshu",
    password: "Kanak123_",
  },
];

const FIRST_NAMES = [
  "Liam", "Oliver", "Noah", "Emma", "Charlotte", "Amira", "Fatima", "Zayn", "Tariq", "Layla",
  "Wei", "Min-seo", "Kenji", "Hana", "Hiroshi", "Yuki", "Ji-eun", "Chen", "Mei", "Takumi",
  "Mateo", "Sofia", "Valentina", "Santiago", "Camila", "Lucia", "Alejandro", "Valeria", "Diego", "Gabriela",
  "Aarav", "Priya", "Ananya", "Rohan", "Ishaan", "Kavya", "Aditya", "Neha", "Vihaan", "Sanya",
  "Lucas", "Mila", "Freja", "Matteo", "Giulia", "Leon", "Elena", "Felix", "Kloster", "Ingrid",
  "Kwame", "Chidi", "Zainab", "Nia", "Amara", "Tariq", "Kofi", "Amina", "Jabari", "Sade"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Al-Sayed", "Hassan", "Bakr", "Abbas", "Mansour",
  "Zhang", "Kim", "Tanaka", "Sato", "Watanabe", "Park", "Lee", "Chen", "Wang", "Takahashi",
  "Silva", "Rodriguez", "Gomez", "Martinez", "Lopez", "Gonzalez", "Hernandez", "Perez", "Sanchez", "Ramirez",
  "Sharma", "Patel", "Gupta", "Singh", "Kumar", "Reddy", "Verma", "Nair", "Iyer", "Chopra",
  "Müller", "Rossi", "Dubois", "Larsen", "Nilsson", "Weber", "Conti", "Moreau", "Novak", "Svensson",
  "Mensah", "Okafor", "Adeyemi", "Touré", "Diallo", "Keita", "Diop", "Nkosi", "Traoré", "Sow"
];

const DEPTS = [
  { dept: "Frontend", desig: "Frontend Engineer", mgr: "Shivanshu" },
  { dept: "Backend", desig: "Backend Developer", mgr: "Avneesh" },
  { dept: "Database Management", desig: "Database Administrator", mgr: "Allen Charles" },
  { dept: "Testing and QA", desig: "QA Analyst", mgr: "Allen Charles" },
  { dept: "Network and Security", desig: "Security Engineer", mgr: "Avneesh" },
  { dept: "Design", desig: "UI/UX Designer", mgr: "Ekta Chaudhary" },
  { dept: "Product", desig: "Product Manager", mgr: "Allen Charles" },
  { dept: "HR", desig: "HR Specialist", mgr: "Allen Charles" },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    console.log("Clearing existing User and Employee records...");
    await Promise.all([UserModel.deleteMany({}), EmployeeModel.deleteMany({})]);

    let org = await OrganizationModel.findOne({ slug: "novanectar" });
    if (!org) {
      org = await OrganizationModel.create({
        name: "NovaNectar",
        slug: "novanectar",
      });
    }

    console.log("Seeding 3 Superadmins...");
    for (const sa of SUPER_ADMINS) {
      const passwordHash = await bcrypt.hash(sa.password, 12);
      const user = await UserModel.create({
        orgId: org._id,
        name: sa.name,
        email: sa.empId.toLowerCase(),
        passwordHash,
        role: "super_admin",
        isActive: true,
      });

      await EmployeeModel.create({
        orgId: org._id,
        userId: user._id,
        employeeCode: sa.empId,
        employeeNumber: sa.empNumber,
        tag: "Super Admin",
        isPhantom: false,
        personal: {
          firstName: sa.firstName,
          lastName: sa.lastName,
          contactEmail: sa.contactEmail,
        },
        work: {
          department: sa.department,
          designation: sa.designation,
          companyEmail: sa.companyEmail,
          manager: sa.manager,
          status: "active",
        },
      });
    }
    console.log("3 Superadmins created.");

    console.log("Generating 700 Realistic International Phantom Employees (Emp Number 004 to 703)...");
    const phantomEmployees = [];
    for (let i = 1; i <= 700; i++) {
      const empNumInt = i + 3;
      const empNumStr = String(empNumInt).padStart(3, "0");
      const deptInfo = DEPTS[i % DEPTS.length];

      // Select diverse international names
      const firstName = FIRST_NAMES[(i * 7 + 3) % FIRST_NAMES.length];
      const lastName = LAST_NAMES[(i * 13 + 5) % LAST_NAMES.length];
      
      // Emp ID starting with "Ph" + initial + last name snippet + number
      const empId = `Ph${firstName.slice(0, 3)}${lastName.slice(0, 3)}${empNumStr}`.replace(/[^a-zA-Z0-9]/g, "");

      phantomEmployees.push({
        orgId: org._id,
        employeeCode: empId,
        employeeNumber: empNumStr,
        tag: "Phantom Employees",
        isPhantom: true,
        personal: {
          firstName,
          lastName,
          contactEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${empNumStr}@novanectar.demo`,
        },
        work: {
          department: deptInfo.dept,
          designation: deptInfo.desig,
          companyEmail: "NA",
          manager: deptInfo.mgr,
          status: "active",
        },
      });
    }

    // Batch insert 700 phantom employees
    await EmployeeModel.insertMany(phantomEmployees);
    console.log("Successfully created 700 Realistic Phantom Employees!");

    const totalEmployees = await EmployeeModel.countDocuments();
    console.log(`Total Employees in Directory: ${totalEmployees}`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
