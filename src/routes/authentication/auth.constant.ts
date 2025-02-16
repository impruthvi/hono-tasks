import { createErrorResponse } from "@/lib/response";
import { Context } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";

export const credentialsInvalid = (c: Context) => createErrorResponse(c, AUTH_MESSAGES.CREDENTIALS_INVALID, HttpStatusCodes.UNAUTHORIZED);

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