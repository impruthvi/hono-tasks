import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

import { pinoCustomLogger } from "@/middlewares/pino-logger";

import type { AppBindings } from "@/lib/types";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
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
