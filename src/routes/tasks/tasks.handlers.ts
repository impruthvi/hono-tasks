import type { AppRouteHandler } from "@/lib/types";
import type { ListRoute } from "@/routes/tasks/tasks.routes";

export const list: AppRouteHandler<ListRoute> = (c) => {
  return c.json([
    { name: "Task 1", done: false },
    { name: "Task 2", done: true },
  ]);
};
