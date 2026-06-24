import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectDatabase } from "./db.js";
import { registerSocket } from "./realtime.js";
import { ensureCollections } from "./seed.js";
import advertisingRoutes from "./routes/advertising.js";
import creatorRoutes from "./routes/creators.js";
import heavyAdRoutes from "./routes/heavyAds.js";
import documentRoutes from "./routes/documents.js";
import dashboardRoutes from "./routes/dashboard.js";
import analyticsRoutes from "./routes/analytics.js";
import optionRoutes from "./routes/options.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
const io = new Server(server, {
  cors: { origin: clientUrl, methods: ["GET", "POST", "PUT", "DELETE"] }
});

registerSocket(io);

app.use(cors({ origin: clientUrl }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/advertising", advertisingRoutes);
app.use("/api/creators", creatorRoutes);
app.use("/api/heavy-ads", heavyAdRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/options", optionRoutes);
app.use("/api", dashboardRoutes);

io.on("connection", (socket) => {
  socket.emit("dashboardUpdated");
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.name === "ValidationError" ? 400 : 500).json({
    message: error.message || "Server error"
  });
});

const port = process.env.PORT || 5000;

await connectDatabase();
await ensureCollections();

server.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
