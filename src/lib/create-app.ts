import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import type { AppBindings, AppOpenApi } from "@/lib/types";

import { pinoCustomLogger } from "@/middlewares/pino-logger";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(serveEmojiFavicon("🔥"));
  app.use(pinoCustomLogger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}

export function createTestApp<R extends AppOpenApi>(router: R) {
  return createApp().route("/", router);
}