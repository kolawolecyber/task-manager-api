import { Response } from "express";
import { AuthRequest } from "../../shared/middlewares/auth.middleware";
import * as taskService from "./task.service";

// =========================
// DTO SANITIZERS
// =========================
const getParamId = (id: unknown): string => {
  if (typeof id !== "string" || !id) {
    throw new Error("Invalid or missing ID");
  }
  return id;
};

const toCreateTaskDTO = (body: any) => ({
  title: body.title,
  assignedTo: body.assignedTo,
  description: body.description ?? "",
  dueDate: body.dueDate,
});

const toUpdateTaskDTO = (body: any) => {
  const dto: any = {};

  if (body.title !== undefined) dto.title = body.title;
  if (body.status !== undefined) dto.status = body.status;
  if (body.description !== undefined) dto.description = body.description;
  if (body.dueDate !== undefined) dto.dueDate = body.dueDate;

  return dto;
};

// =========================
// CREATE TASK
// =========================
export const create = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = toCreateTaskDTO(req.body);

    const task = await taskService.createTask(
      data,
      req.user.userId   // ✅ FIX
    );

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// GET ALL TASKS
// =========================
export const getAll = async (req: AuthRequest, res: Response) => {
  const tasks = await taskService.getTasks(req.query);

  return res.json({
    success: true,
    data: tasks,
  });
};

// =========================
// GET SINGLE TASK
// =========================
export const getOne = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await taskService.getTaskById(
      getParamId(req.params.id),
      req.user   // ✅ FIX
    );

    return res.json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// =========================
// UPDATE TASK
// =========================
export const update = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = toUpdateTaskDTO(req.body);

    const task = await taskService.updateTask(
       getParamId(req.params.id),
      data,
      req.user   // ✅ FIX
    );

    return res.json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// =========================
// DELETE TASK
// =========================
export const remove = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await taskService.deleteTask(
       getParamId(req.params.id),
      req.user   // ✅ FIX
    );

    return res.json({
      success: true,
      message: "Task deleted",
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};