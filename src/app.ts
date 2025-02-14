import type { PinoLogger } from "hono-pino";

import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError } from "stoker/middlewares";

import { pinoCustomLogger } from "./middlewares/pino-logger";

type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};

const app = new OpenAPIHono<AppBindings>();

app.use(pinoCustomLogger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/error", (c) => {
  c.var.logger.info("This is an info log");
  throw new Error("This is an error");
});

app.get();

app.notFound(notFound);
app.onError(onError);

export default app;
