import type { Context } from "hono";

import * as HttpStatusCodes from "stoker/http-status-codes";
import { z } from "zod";

export function createCreateRoute(
  data: z.ZodSchema<any>,
  message: string,
) {
  return z.object({
    success: z.literal(true),
    data,
    meta: z.object({
      message: z.literal(message),
    }),
  });
}

export function createCreateResponse<T>(c: Context, data: T, message: string) {
  return c.json({
    success: true,
    data,
    meta: {
      message,
    },
  }, HttpStatusCodes.CREATED);
}

export function createUpdateRoute(
  data: z.ZodSchema<any>,
  message: string,
) {
  return z.object({
    success: z.literal(true),
    data,
    meta: z.object({
      message: z.literal(message),
    }),
  });
}

export function createUpdateResponse<T>(c: Context, data: T, message: string) {
  return c.json({
    success: true,
    data,
    meta: {
      message,
    },
  }, HttpStatusCodes.OK);
}
