import { Context } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { z } from "zod";

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Expected number, received nan",
  NO_UPDATES: "No updates provided",
};

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
};

interface ZodErrorIssue {
  code: string;
  path: string[];
  message: string;
}
interface ErrorResponse {
  success: false;
  error: {
    issues: ZodErrorIssue[];
    name: string;
  };
}

/**
 * Creates a standardized "not found" error response
 * @param c - Hono Context
 * @param errorCode - Error code constant
 * @param status - HTTP status code (defaults to 422 UNPROCESSABLE_ENTITY)
 */
export const createNotFoundError = (
  c: Context,
  errorCode: {
    code: string;
    path: string[];
    message: string;
  },
  status: ContentfulStatusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY as ContentfulStatusCode
) => {
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
};

/**
 * Creates a standardized Zod error response schema
 * @param errorCode - Error code constant containing code and message
 * @returns Zod schema for the error response
 */
export const createErrorResponseSchema = (errorCode: {
  code: string;
  message: string;
}) => {
  return z.object({
    success: z.literal(false),
    error: z.object({
      issues: z.array(
        z.object({
          code: z.literal(errorCode.code),
          path: z.array(z.string()),
          message: z.literal(errorCode.message),
        })
      ),
      name: z.literal("ZodError"),
    }),
  });
};