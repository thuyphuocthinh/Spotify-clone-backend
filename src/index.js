import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import songsRoutes from "./routes/song.route.js";
import albumsRoutes from "./routes/album.route.js";
import statsRoutes from "./routes/stats.route.js";
import fileUpload from "express-fileupload";
import { connectDB } from "./config/database.config.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { initializeSocket } from "./config/socket.config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// server for express, socket
const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
// this will add auth to request object => req.auth
app.use(clerkMiddleware());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  })
);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songsRoutes);
app.use("/api/albums", albumsRoutes);
app.use("/api/stats", statsRoutes);

// 500 error handler
app.use((err, req, res, next) => {
  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

httpServer.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
