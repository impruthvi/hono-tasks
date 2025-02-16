import type { Context } from "hono";

import * as HttpStatusCodes from "stoker/http-status-codes";
import { z } from "zod";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "./constants";

export function createListRoute<T extends z.ZodTypeAny>(data: T) {
  return z.object({
    success: z.literal(true),
    data: z.array(data),
    meta: z.object({
      limit: z.number(),
      offset: z.number(),
      total: z.number(),
      message: z.string(),
    }),
  });
}

export function createListResponse<T>(
  c: Context,
  data: T,
  meta: {
    limit: number;
    offset: number;
    total: number;
    message: string;
  },
) {
  return c.json({
    success: true,
    data,
    meta,
  }, HttpStatusCodes.OK);
}

export function createGetOneRoute(data: z.ZodSchema<any>) {
  return z.object({
    success: z.literal(true),
    data,
    meta: z.object({
      message: z.string(),
    }),
  });
}

export function createGetOneResponse<T>(c: Context, data: T, message: string) {
  return c.json({
    success: true,
    data,
    meta: {
      message,
    },
  }, HttpStatusCodes.OK);
}

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

export function createDeleteRoute(message: string) {
  return z.object({
    success: z.literal(true),
    meta: z.object({
      message: z.literal(message),
    }),
  });
}

export function createDeleteResponse(c: Context, message: string) {
  return c.json({
    success: true,
    meta: {
      message,
    },
  }, HttpStatusCodes.ACCEPTED);
}


export const unauthorizedErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    issues: z.array(z.object({
      code: z.literal(ZOD_ERROR_CODES.INVALID_TOKEN),
      path: z.array(z.string()),
      message: z.literal(ZOD_ERROR_MESSAGES.UNAUTHORIZED),
    })),
    name: z.literal('ZodError')
  })
});