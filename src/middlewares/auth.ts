// auth.middleware.ts
import { jwt } from 'hono/jwt';
import { Context, Next } from 'hono';
import env from '@/env';
import * as HttpStatusCodes from "stoker/http-status-codes";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '@/lib/constants';

export const createAuthMiddleware = () => {
    return async (c: Context, next: Next) => {
        try {
            await jwt({
                secret: env.JWT_SECRET_KEY,
            })(c, next);
            await next();
        } catch (error) {
            return c.json({
                success: false,
                error: {
                    issues: [
                        {
                            code: ZOD_ERROR_CODES.INVALID_TOKEN,
                            path: [],
                            message: ZOD_ERROR_MESSAGES.UNAUTHORIZED,
                        },
                    ],
                    name: "ZodError",
                },
            },
                HttpStatusCodes.UNAUTHORIZED,
            );
        }
    };
};