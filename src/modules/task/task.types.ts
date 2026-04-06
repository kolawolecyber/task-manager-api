export type TaskStatus = "pending" | "in-progress" | "done";

export interface AuthUser {
  userId: string;
  email?: string;
  role?: "admin" | "user";
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  assignedTo?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
 status?: "pending" | "in-progress" | "completed";
  assignedTo?: string;
  dueDate?: Date | string;
}
