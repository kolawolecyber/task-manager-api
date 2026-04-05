import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  assignedTo: z.string(),
  dueDate: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  status: z
    .enum(["pending", "in-progress", "completed"])
    .optional(),
});