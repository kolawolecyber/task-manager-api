import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import taskRoutes from "./modules/task/task.route";




const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;