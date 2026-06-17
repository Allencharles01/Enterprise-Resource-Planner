import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { connectMongo, isMongoConnected } from "./lib/mongo.js";
import { env } from "./lib/env.js";
import { apiRouter } from "./routes/index.js";

async function main() {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: env.WEB_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) =>
    res.json({ ok: true, mongo: { connected: isMongoConnected() } }),
  );
  app.use("/api", (_req, res, next) => {
    if (!isMongoConnected()) {
      return res.status(503).json({
        error: "db_unavailable",
        message:
          "MongoDB is not connected. Check MONGODB_URI and network/IP whitelist.",
      });
    }
    next();
  });

  // Routes
  app.use("/api", apiRouter);

  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });

  // Keep trying to connect in dev environments where MongoDB may start later.
  connectMongo(env.MONGODB_URI).catch((err) => {
    console.error("Mongo connection failed:", err);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
