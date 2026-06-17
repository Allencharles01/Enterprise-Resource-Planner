import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ["super_admin", "org_admin", "hr", "manager", "employee"],
      default: "employee",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

UserSchema.index({ orgId: 1, email: 1 }, { unique: true });

export const UserModel = model("User", UserSchema);
