import mongoose, { Schema } from "mongoose";

const TrainingCourseSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    currency: { type: String, default: "INR (₹)" },
  },
  { timestamps: true }
);

export default mongoose.models.TrainingCourse ||
  mongoose.model("TrainingCourse", TrainingCourseSchema);
