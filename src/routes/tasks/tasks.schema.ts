import { selectTasksSchema } from "@/db/schema";
import { z } from "zod";
import { ZOD_ERROR_TASK_NOT_FOUND } from "./tasks.constants";
import { createErrorResponseSchema } from "@/lib/constants";

export const listQuerySchema = z.object({
    limit: z.coerce.number({
        message: "Limit must be a number",
    }).int({
        message: "Limit must be an integer",
    }).positive({
        message: "Limit must be a positive integer",
    }).default(10),
    offset: z.coerce.number({
        message: "Offset must be a number",
    }).int({
        message: "Offset must be an integer",
    }).nonnegative({
        message: "Offset must be a non-negative integer",
    }).default(0),
});

export const listResponseSchema = z.object({
    success: z.literal(true),
    data: z.array(selectTasksSchema),
    meta: z.object({
        limit: z.number(),
        offset: z.number(),
        total: z.number(),
        message: z.string(),
    }),
});

export const taskNotFoundSchema = createErrorResponseSchema(ZOD_ERROR_TASK_NOT_FOUND);