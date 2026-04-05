import express from "express";
import * as taskController from "./task.controller";
import { protect } from "../../shared/middlewares/auth.middleware";

const router = express.Router();

router.use(protect);


router.post("/", taskController.create);
router.get("/", taskController.getAll);

router.get("/:id", taskController.getOne);

router.put("/:id", taskController.update);
router.delete("/:id", taskController.remove);

export default router;