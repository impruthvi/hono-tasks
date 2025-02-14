import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

import { pinoCustomLogger } from "@/middlewares/pino-logger";

import type { AppBindings } from "./type";

export default function createApp() {
  const app = new OpenAPIHono<AppBindings>({
    strict: false,
  });

  app.use(serveEmojiFavicon("🔥"));
  app.use(pinoCustomLogger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
