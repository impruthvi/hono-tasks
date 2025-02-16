import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";


import { LoginRoute, RegisterRoute } from "./auth.routes";
import { AuthService } from "@/lib/auth-service";
import { AUTH_MESSAGES, credentialsInvalid } from "./auth.constant";
import type { RouteConfigToTypedResponse } from "@hono/zod-openapi";

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const { email, password } = c.req.valid("json");
  const user = await AuthService.validateUser(
    email,
    password
  );

  if (!user) {
    return credentialsInvalid(c) as RouteConfigToTypedResponse<LoginRoute>;
  }

  const token = AuthService.generateToken(user!);

  return c.json({
    success: true,
    data: {
      user,
    },
    meta: {
      token,
      message: AUTH_MESSAGES.LOGIN_SUCCESS.message,
    }
  }, HttpStatusCodes.OK);

}

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const { email, password } = c.req.valid("json");
  const user = await AuthService.createUser(
    email,
    password
  );

  const token = AuthService.generateToken(user);

  return c.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
    meta: {
      token,
      message: AUTH_MESSAGES.REGISTER_SUCCESS.message,
    }
  }, HttpStatusCodes.CREATED);
}
