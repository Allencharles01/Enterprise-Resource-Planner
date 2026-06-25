import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    client: { type: String, required: true },
    manager: { type: String, required: true },
    status: { type: String, required: true, default: "Ongoing" },
    deadline: { type: Date },
    departments: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export default mongoose.model("Project", ProjectSchema);
