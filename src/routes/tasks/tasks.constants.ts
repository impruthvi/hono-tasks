import type { Context } from "hono";

import { createNotFoundError } from "@/lib/response";

export const ZOD_ERROR_TASK_NOT_FOUND = {
  code: "task_not_found",
  message: "Task not found",
  path: ["tasks", "id"],
};

export const taskNotFound = (c: Context) => createNotFoundError(c, ZOD_ERROR_TASK_NOT_FOUND);

export const TASK_CREATE = {
  code: "task_create",
  message: "Task created successfully",
};

export const TASK_UPDATE = {
  code: "task_update",
  message: "Task updated successfully",
};

export const TASK_DELETE = {
  code: "task_delete",
  message: "Task deleted successfully",
};

export const TASK_LIST = {
  code: "task_list",
  message: "Tasks listed successfully",
};

export const TASK_GET_ONE = {
  code: "task_get_one",
  message: "Task retrieved successfully",
};
