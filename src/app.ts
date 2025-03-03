import configureOpenApi from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import auth from "@/routes/authentication/auth.index";
import index from "@/routes/index.route";
import tasks from "@/routes/tasks/tasks.index";

const app = createApp();

const routes = [
  auth,
  index,
  tasks,
] as const;

configureOpenApi(app);

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
