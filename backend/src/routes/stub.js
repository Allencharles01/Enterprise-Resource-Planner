import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";

export function createStubRouter(moduleName) {
  const r = Router();
  r.use(requireAuth);

  r.get("/", (_req, res) =>
    res.status(501).json({ error: "not_implemented", module: moduleName }),
  );
  r.post("/", (_req, res) =>
    res.status(501).json({ error: "not_implemented", module: moduleName }),
  );
  r.get("/:id", (_req, res) =>
    res.status(501).json({ error: "not_implemented", module: moduleName }),
  );
  r.patch("/:id", (_req, res) =>
    res.status(501).json({ error: "not_implemented", module: moduleName }),
  );
  return r;
}
