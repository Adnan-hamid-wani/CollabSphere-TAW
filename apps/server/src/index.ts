import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/tasks.routes";
import userRoutes from "./routes/tasks.routes";
import http from "http";
import { Server } from "socket.io";
import analyticsRoutes from "./routes/analytics.routes";
import fileRoutes from "./routes/file.routes";
import path from "path";
import aiRoutes from "./routes/ai.routes"; // ✅ Import AI routes
import messageRoutes from "./routes/message.routes"; // ✅ Import message routes
import emailRoutes from "./routes/email.routes"; // ✅ Import email routes



dotenv.config();

const app = express();

// ✅ CORS must come before any routes or sockets
app.use(cors({
  origin: "http://localhost:5173", // Your frontend origin
  credentials: true,
}));

app.use(express.json());

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});





io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  const userRole = socket.handshake.query.role;

  if (userId) socket.join(userId);
  if (userRole === "ADMIN") socket.join("admin");

  console.log(`🔌 Socket connected: ${userId} (${userRole})`);
});

app.set("io", io);

// ✅ API routes must come after CORS and socket setup
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin-analytics", analyticsRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/files", fileRoutes); // ✅ Must add this
app.use("/api/ai", aiRoutes); // ✅ AI routes
app.use("/api/email", emailRoutes);

app.use("/api/messages", messageRoutes); // ✅ Clean and typed


// ✅ Use server.listen
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
