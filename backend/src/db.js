import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/digital_marketing_dashboard";
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  return mongoose.connection;
}
