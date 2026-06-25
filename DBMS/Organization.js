import { Schema, model } from "mongoose";

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true },
);

export const OrganizationModel = model("Organization", OrganizationSchema);
