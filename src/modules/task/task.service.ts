import { Task } from "./task.model";
import { getIO } from "../../config/socket";
import { AuthUser, CreateTaskDTO, UpdateTaskDTO } from "./task.types";
import mongoose from "mongoose";

// =========================
// CREATE TASK
// =========================
export const createTask = async (data: CreateTaskDTO, userId: string) => {
  const task = await Task.create({
    ...data,
    createdBy: userId,
  });

  getIO().emit("taskCreated", task);
  return task;
};

// =========================
// UPDATE TASK (SECURE RBAC)
// =========================
export const updateTask = async (id: string, data: UpdateTaskDTO, user: AuthUser) => {
  const task = await Task.findById(id);
  if (!task) throw new Error("Task not found");

  // ✅ SAFE ID COMPARISON (Handles populated or raw ObjectIds)
  const creatorId = task.createdBy._id?.toString() || task.createdBy.toString();
  const assigneeId = task.assignedTo?._id?.toString() || task.assignedTo?.toString();

  const isCreator = creatorId === user.userId;
  const isAssigned = assigneeId === user.userId;
  const isAdmin = user.role === "admin";

  // 🔒 STATUS UPDATE RULE: Creator, Assignee, or Admin can change status
  if (data.status && !isAssigned && !isCreator && !isAdmin) {
    throw new Error("Not allowed to update status for this task");
  }

  // 🔒 GENERAL UPDATE RULE: Only Creator or Admin can change Title/Desc/Date
  if ((data.title || data.description || data.dueDate) && !isCreator && !isAdmin) {
    throw new Error("Not allowed to update task details");
  }

  Object.assign(task, data);
  await task.save();

  getIO().emit("taskUpdated", task);
  return task;
};

// =========================
// DELETE TASK (SECURE RBAC)
// =========================
export const deleteTask = async (id: string, user: AuthUser) => {
  const task = await Task.findById(id);
  if (!task) throw new Error("Task not found");

  const isCreator = task.createdBy.toString() === user.userId;
  const isAdmin = user.role === "admin";

  if (!isCreator && !isAdmin) {
    throw new Error("Not allowed to delete this task");
  }

  await task.deleteOne();
  getIO().emit("taskDeleted", { id });
  return true;
};

// =========================
// GET SINGLE TASK
// =========================
export const getTaskById = async (id: string, user: AuthUser) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid task ID");
  }

  const task = await Task.findById(id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  if (!task) throw new Error("Task not found");

  const creatorId = task.createdBy._id?.toString() || task.createdBy.toString();
  const assigneeId = task.assignedTo?._id?.toString() || task.assignedTo?.toString();

  if (creatorId !== user.userId && assigneeId !== user.userId && user.role !== "admin") {
    throw new Error("You are not allowed to view this task");
  }

  return task;
};

// =========================
// GET ALL TASKS (FILTER & SEARCH)
// =========================
export const getTasks = async (query: any) => {
  const filter: any = {};

  // 1. 🔍 WORD SEARCH
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } }
    ];
  }

  // 2. 🚦 STATUS FILTER (Synced with Model Enum)
  const allowedStatus = ["pending", "in-progress", "completed"]; 
  if (query.status && allowedStatus.includes(query.status)) {
    filter.status = query.status;
  }

  // 3. 👤 ASSIGNEE FILTER
  if (query.assignedTo && mongoose.Types.ObjectId.isValid(query.assignedTo)) {
    filter.assignedTo = query.assignedTo;
  }

  return Task.find(filter)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};