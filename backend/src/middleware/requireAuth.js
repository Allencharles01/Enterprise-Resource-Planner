import { verifyAccessToken } from "../lib/auth.js";

export async function requireAuth(req, res, next) {
  const header = req.header("authorization") ?? "";
  const [, token] = header.split(" ");

  if (token && token !== "undefined" && token !== "null") {
    try {
      const payload = verifyAccessToken(token);
      req.auth = {
        userId: payload.sub,
        orgId: payload.orgId,
        role: payload.role,
      };
      return next();
    } catch {
      // Token expired or invalid from previous sessions
    }
  }

  if (process.env.NODE_ENV !== "production") {
    // Zero-latency dev bypass using seeded super admin credentials
    req.auth = {
      userId: "6a3d4a3ef2c0abccaa8ad0eb",
      orgId: "6a3d4a3ef2c0abccaa8ad0e9",
      role: "super_admin",
    };
    return next();
  }

  return res
    .status(401)
    .json({ error: token ? "invalid_token" : "missing_token" });
}
