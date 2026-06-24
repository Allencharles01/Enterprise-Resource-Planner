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
