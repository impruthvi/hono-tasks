import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import * as HttpStatusCodes from "stoker/http-status-codes";
import { z } from "zod";

type ZodErrorIssue = {
  code: string;
  path: string[];
  message: string;
};
type ErrorResponse = {
  success: false;
  error: {
    issues: ZodErrorIssue[];
    name: string;
  };
};
/**
 * Creates a standardized "not found" error response
 * @param c - Hono Context
 * @param errorCode - Error code constant containing code, path, and message
 * @param status - HTTP status code (defaults to 422 UNPROCESSABLE_ENTITY)
 */
export function createNotFoundError(c: Context, errorCode: {
  code: string;
  path: string[];
  message: string;
}, status: ContentfulStatusCode = HttpStatusCodes.NOT_FOUND as ContentfulStatusCode) {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      issues: [
        {
          code: errorCode.code,
          path: errorCode.path,
          message: errorCode.message,
        },
      ],
      name: "ZodError",
    },
  };

  return c.json(errorResponse, status);
}

/**
 * Creates a standardized Zod error response schema
 * @param errorCode - Error code constant containing code and message
 *
 * @returns Zod schema for the error response
 */
export function createErrorResponseSchema(errorCode: {
  code: string;
  message: string;
}) {
  return z.object({
    success: z.literal(false),
    error: z.object({
      issues: z.array(
        z.object({
          code: z.literal(errorCode.code),
          path: z.array(z.string()),
          message: z.literal(errorCode.message),
        }),
      ),
      name: z.literal("ZodError"),
    }),
  });
}
