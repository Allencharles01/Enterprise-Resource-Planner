import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

// Ensure we always load apps/api/.env even when started from monorepo root.
export function loadApiEnv() {
  const here = dirname(fileURLToPath(import.meta.url));
  const apiRoot = resolve(here, "../../");
  dotenv.config({ path: resolve(apiRoot, ".env") });
}
