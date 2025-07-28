import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import path from "path";

// ✅ Route imports
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/tasks.routes";
import userRoutes from "./routes/tasks.routes"; // ✅ FIXED: should not import taskRoutes again
import analyticsRoutes from "./routes/analytics.routes";
import fileRoutes from "./routes/file.routes";
import aiRoutes from "./routes/ai.routes";
import messageRoutes from "./routes/message.routes";
import emailRoutes from "./routes/email.routes";

// ✅ Load .env
dotenv.config();

const app = express();

// ✅ Allow listed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://collab-sphere.vercel.app",
  "https://collab-sphere-nfkmi58sv-adnan-hamid-wanis-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Create server
const server = http.createServer(app);

// ✅ Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ✅ Socket.IO connection logic
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;
  const userRole = socket.handshake.query.role as string;

  if (userId) socket.join(userId);
  if (userRole === "ADMIN") socket.join("admin");

  console.log(`🔌 Socket connected: ${userId || "unknown"} (${userRole || "no-role"})`);
});

// ✅ Make io available in controllers
app.set("io", io);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes); // ✅ FIXED: now actually user routes
app.use("/api/admin-analytics", analyticsRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
