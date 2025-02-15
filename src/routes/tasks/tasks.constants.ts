import { createNotFoundError } from "@/lib/constants";
import { Context } from "hono";

export const ZOD_ERROR_TASK_NOT_FOUND = {
    code: "task_not_found",
    message: "Task not found",
    path: ["tasks", "id"],
};

export const taskNotFound = (c: Context) => createNotFoundError(c, ZOD_ERROR_TASK_NOT_FOUND);
