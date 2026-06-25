import { verifyAccessToken } from "../lib/auth.js";

export function requireAuth(req, res, next) {
  const header = req.header("authorization") ?? "";
  const [, token] = header.split(" ");
  if (!token) return res.status(401).json({ error: "missing_token" });

  try {
    const payload = verifyAccessToken(token);
    req.auth = {
      userId: payload.sub,
      orgId: payload.orgId,
      role: payload.role,
    };
    next();
  } catch {
    return res.status(401).json({ error: "invalid_token" });
  }
}
