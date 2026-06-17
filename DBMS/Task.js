import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    manager: { type: String, required: true },
    membersCount: { type: Number, required: true, default: 1 },
    isComplete: { type: Boolean, required: true, default: false },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    deadline: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("Task", TaskSchema);
