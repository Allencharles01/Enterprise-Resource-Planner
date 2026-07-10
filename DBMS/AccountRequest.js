import mongoose, { Schema } from "mongoose";

const AccountRequestSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("AccountRequest", AccountRequestSchema);
