import { createRouter } from "@/lib/create-app";
import { createAuthMiddleware } from "@/middlewares/auth";

import * as handlers from "./tasks.handlers";
import * as routes from "./tasks.routes";

const router = createRouter();

router.use("/*", createAuthMiddleware());

export default router
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove);
