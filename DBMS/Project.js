import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    client: { type: String, required: true },
    clientPhone: { type: String },
    clientCountryCode: { type: String, default: "+1" },
    clientEmail: { type: String },
    manager: { type: String, required: true },
    status: { type: String, required: true, default: "Ongoing" },
    budget: { type: String },
    currency: { type: String, default: "USD" },
    deadline: { type: Date },
    projectDetails: { type: String },
    files: [
      {
        name: { type: String },
        url: { type: String },
        type: { type: String },
      },
    ],
    departments: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export default mongoose.model("Project", ProjectSchema);
