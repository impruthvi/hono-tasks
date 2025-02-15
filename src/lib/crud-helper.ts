import type { Context } from "hono";

import * as HttpStatusCodes from "stoker/http-status-codes";
import { z } from "zod";

export function createListRoute(data: z.ZodSchema<any>) {
  return z.object({
    success: z.literal(true),
    data,
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
