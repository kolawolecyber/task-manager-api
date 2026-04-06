import express from "express";
import { register, login, getUsers } from "./auth.controller";
import { protect } from "../../shared/middlewares/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", protect, getUsers);

export default router;