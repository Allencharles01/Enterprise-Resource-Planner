import { z } from "zod";
import { loadApiEnv } from "./loadEnv.js";

loadApiEnv();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1)),
  JWT_SECRET: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(16)),
  WEB_ORIGIN: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1))
    .default("http://localhost:3000"),
  RESEND_API_KEY: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);
