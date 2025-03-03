import { z } from "zod";

import { createErrorResponseSchema } from "@/lib/response";

import { TASK_MESSAGES } from "./tasks.constants";

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

export const taskNotFoundSchema = createErrorResponseSchema(TASK_MESSAGES.NOT_FOUND);
