import type { Context } from "hono";

import * as HttpStatusCodes from "stoker/http-status-codes";

import { createErrorResponse } from "@/lib/response";

export const AUTH_MESSAGES = {
  CREDENTIALS_INVALID: {
    code: "credentials_invalid",
    message: "Invalid credentials",
    path: ["email", "password"],
  },
  LOGIN_SUCCESS: {
    code: "login_success",
    message: "User logged in successfully",
  },
  REGISTER_SUCCESS: {
    code: "register_success",
    message: "User registered successfully",
  },
};

export const credentialsInvalid = (c: Context) => createErrorResponse(c, AUTH_MESSAGES.CREDENTIALS_INVALID, HttpStatusCodes.UNAUTHORIZED);
