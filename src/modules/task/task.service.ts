import { Task } from "./task.model";
import { getIO } from "../../config/socket";
import { AuthUser, CreateTaskDTO, UpdateTaskDTO } from "./task.types";
import mongoose from "mongoose"; // ✅ ADD THIS

// =========================
// CREATE TASK
// =========================
export const createTask = async (
  data: CreateTaskDTO,
  userId: string
) => {
  const task = await Task.create({
    ...data,
    createdBy: userId,
  });

  getIO().emit("taskCreated", task);

  return task;
};

// =========================
// GET TASKS (FILTER SAFE)
// =========================
export const getTasks = async (query: any) => {
  const filter: any = {};

  const allowedStatus = ["pending", "in-progress", "done"];

  if (query.status && allowedStatus.includes(query.status)) {
    filter.status = query.status;
  }

  if (query.assignedTo) {
    filter.assignedTo = query.assignedTo;
  }

  return Task.find(filter)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

// =========================
// UPDATE TASK (SECURE RBAC)
// =========================
export const updateTask = async (
  id: string,
  data: UpdateTaskDTO,
  user: AuthUser
) => {
  const task = await Task.findById(id);

  if (!task) throw new Error("Task not found");

  const isCreator =
    task.createdBy.toString() === user.userId;

  const isAssigned =
    task.assignedTo?.toString() === user.userId;

  const isAdmin = user.role === "admin";

  // 🔒 STATUS UPDATE RULE
  if (data.status && !isAssigned && !isAdmin) {
    throw new Error("Not allowed to update status");
  }

  // 🔒 GENERAL UPDATE RULE
  if (!data.status && !isCreator && !isAdmin) {
    throw new Error("Not allowed to update task");
  }

  Object.assign(task, data);

  await task.save();

  getIO().emit("taskUpdated", task);

  return task;
};

// =========================
// DELETE TASK (SECURE RBAC)
// =========================
export const deleteTask = async (
  id: string,
  user: AuthUser
) => {
  const task = await Task.findById(id);

  if (!task) throw new Error("Task not found");

  const isCreator =
    task.createdBy.toString() === user.userId;

  const isAdmin = user.role === "admin";

  if (!isCreator && !isAdmin) {
    throw new Error("Not allowed to delete this task");
  }

  await task.deleteOne();

  getIO().emit("taskDeleted", { id });

  return true;
};
export const getTaskById = async (
  id: string,
  user: AuthUser
) => {
  // 🔒 Validate ID first (prevents Mongo crash + injection safety)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid task ID");
  }

  const task = await Task.findById(id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  if (!task) {
    throw new Error("Task not found");
  }

  const isCreator =
    task.createdBy.toString() === user.userId;

  const isAssigned =
    task.assignedTo?.toString() === user.userId;

  const isAdmin = user.role === "admin";

  // 🔒 ACCESS CONTROL
  if (!isCreator && !isAssigned && !isAdmin) {
    throw new Error("You are not allowed to view this task");
  }

  return task;
};