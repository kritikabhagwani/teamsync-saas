const dotenv = require("dotenv");
dotenv.config();

// Fix MongoDB Atlas DNS issue
require("node:dns").setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const userRoutes = require("./routes/userRoutes");
const memberRoutes = require("./routes/memberRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes=require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const activityRoutes = require("./routes/activityRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// ============================
// Connect Database
// ============================
connectDB();

// ============================
// Middlewares
// ============================
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/api/members", memberRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activity", activityRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TeamSync Backend Running 🚀",
  });
});

// Test Route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend Connected Successfully",
  });
});

// ============================
// API Routes
// ============================
app.use("/api/auth", authRoutes);

app.use("/api/organizations", organizationRoutes);

app.use("/api/users", userRoutes);
app.use(errorHandler);
// ============================
// 404 Route
// ============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ============================
// Start Server
// ============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

