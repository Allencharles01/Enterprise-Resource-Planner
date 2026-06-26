import mongoose, { Schema } from "mongoose";

const InternshipCourseSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    currency: { type: String, default: "USD ($)" },
    prices: {
      month1: { type: String, default: "" },
      month2: { type: String, default: "" },
      month3: { type: String, default: "" },
      month6: { type: String, default: "" },
      month12: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.InternshipCourse ||
  mongoose.model("InternshipCourse", InternshipCourseSchema);
