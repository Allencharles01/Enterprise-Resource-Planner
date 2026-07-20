import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { ContactListModel } from "dbms/ContactList.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/erp";

async function cleanup() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const filenames = ["TestData.csv", "sample_people_with_5_duplicates.csv"];

    // 1. Delete from database
    const dbResult = await ContactListModel.deleteMany({
      fileName: { $in: filenames }
    });
    console.log(`Deleted ${dbResult.deletedCount} database contact list records.`);

    // 2. Delete physical files from CSV Docs if present
    const csvDocsPath = path.resolve(process.cwd(), "../CSV Docs");
    if (fs.existsSync(csvDocsPath)) {
      const deleteFileRecursive = (dir) => {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            deleteFileRecursive(fullPath);
            // If directory is now empty, delete it
            if (fs.readdirSync(fullPath).length === 0) {
              fs.rmdirSync(fullPath);
            }
          } else if (filenames.includes(entry.name)) {
            fs.unlinkSync(fullPath);
            console.log(`Deleted physical file: ${fullPath}`);
          }
        }
      };
      deleteFileRecursive(csvDocsPath);
    }

    console.log("Cleanup complete.");
    process.exit(0);
  } catch (err) {
    console.error("Cleanup failed:", err);
    process.exit(1);
  }
}

cleanup();
