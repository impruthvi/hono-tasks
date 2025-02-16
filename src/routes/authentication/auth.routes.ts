import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { insertUsersSchema, loginUsersSchema, selectUsersSchemaWithoutPassword } from "@/db/schema";
import { createErrorResponseSchema } from "@/lib/response";
import { AUTH_MESSAGES } from "./auth.constant";
import { createErrorSchema } from "stoker/openapi/schemas";

const tags = ["Authentication"];

export const login = createRoute({
  tags,
  path: "/login",
  method: "post",
  request: {
    body: jsonContentRequired(loginUsersSchema, "The user to login"),
    headers: z.object({
      authorization: z.string().nonempty("Authorization header is required"),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        success: z.literal(true),
        data: z.object({
          user: selectUsersSchemaWithoutPassword,
        }),
        meta: z.object({
          message: z.string(),
          token: z.string(),
        }),
      }),
      AUTH_MESSAGES.LOGIN_SUCCESS.message,
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createErrorResponseSchema(AUTH_MESSAGES.CREDENTIALS_INVALID),
      AUTH_MESSAGES.CREDENTIALS_INVALID.message,
    ),
  },
});

export const register = createRoute({
  tags,
  path: "/register",
  method: "post",
  request: {
    body: jsonContentRequired(insertUsersSchema, "The user to register"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({
        success: z.literal(true),
        data: z.object({
          user: selectUsersSchemaWithoutPassword,
        }),
        meta: z.object({
          message: z.string(),
          token: z.string(),
        }),
      }),
      AUTH_MESSAGES.REGISTER_SUCCESS.message,
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUsersSchema),
      "The validation error(s)",
    ),
  },
});


export type LoginRoute = typeof login;
export type RegisterRoute = typeof register;