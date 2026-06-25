import Activity from "../models/Activity.js";

export async function createActivity(message, type) {
  return Activity.create({ message, type, timestamp: new Date() });
}
