import express from "express";

import cors from "cors";

import authRoutes from "./modules/auth/auth.route";

import helmet from "helmet";

import rateLimit from "express-rate-limit";

import taskRoutes from "./modules/task/task.route";









const app = express();

const allowedOrigins = process.env.FRONTEND_URL? process.env.FRONTEND_URL.split(",") 
  : ["http://localhost:5173"];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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