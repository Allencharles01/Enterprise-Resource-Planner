import mongoose from "mongoose";

let connected = false;

mongoose.set("bufferCommands", false);

export async function connectMongo(uri, opts) {
  if (connected) return;
  const retries = opts?.retries ?? 50;
  const delayMs = opts?.delayMs ?? 2000;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      connected = true;
      return;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

export function isMongoConnected() {
  return connected && mongoose.connection.readyState === 1;
}
