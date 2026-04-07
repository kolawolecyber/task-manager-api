import express from "express";

import cors from "cors";

import authRoutes from "./modules/auth/auth.route";

import helmet from "helmet";

import rateLimit from "express-rate-limit";

import taskRoutes from "./modules/task/task.route";









const app = express();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin: frontendUrl, // No array, no split—just the direct string
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use(helmet());


const authLimiter =rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 100,

});



app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/tasks", taskRoutes);



app.get("/", (req, res) => {

  res.send("API is running...");

});



export default app;