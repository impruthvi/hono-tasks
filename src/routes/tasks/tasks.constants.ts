import type { Context } from "hono";

import { createErrorResponse } from "@/lib/response";

export const TASK_MESSAGES = {
  NOT_FOUND: {
    code: "task_not_found",
    message: "Task not found",
    path: ["tasks", "id"],
  },
  CREATE: {
    code: "task_create",
    message: "Task created successfully",
  },
  UPDATE: {
    code: "task_update",
    message: "Task updated successfully",
  },
  DELETE: {
    code: "task_delete",
    message: "Task deleted successfully",
  },
  LIST: {
    code: "task_list",
    message: "Tasks listed successfully",
  },
  GET_ONE: {
    code: "task_get_one",
    message: "Task retrieved successfully",
  },
};

export const taskNotFound = (c: Context) => createErrorResponse(c, TASK_MESSAGES.NOT_FOUND);
