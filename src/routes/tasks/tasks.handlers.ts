import { count, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "@/routes/tasks/tasks.routes";

import db from "@/db";
import { tasks } from "@/db/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import { createCreateResponse, createDeleteResponse, createListResponse, createUpdateResponse } from "@/lib/crud-helper";

import { TASK_CREATE, TASK_DELETE, TASK_UPDATE, taskNotFound } from "./tasks.constants";
import { RouteConfigToTypedResponse } from "@hono/zod-openapi";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { limit, offset } = c.req.valid("query");

  const paginatedTask = await db.query.tasks.findMany({
    limit,
    offset,
  });

  const [total] = await db.select({ count: count() }).from(tasks);

  return createListResponse<typeof paginatedTask>(c, paginatedTask, {
    limit,
    offset,
    total: total.count,
    message: TASK_CREATE.message,
  });
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const task = c.req.valid("json");
  const [inserted] = await db.insert(tasks).values(task).returning();
  return createCreateResponse<typeof inserted>(c, inserted, TASK_CREATE.message);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const task = await db.query.tasks.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!task) {
    return taskNotFound(c) as RouteConfigToTypedResponse<GetOneRoute>;
  }

  return c.json(task, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [task] = await db.update(tasks)
    .set(updates)
    .where(eq(tasks.id, id))
    .returning();
  if (!task) {
    return taskNotFound(c) as RouteConfigToTypedResponse<PatchRoute>;
  }

  return createUpdateResponse<typeof task>(c, task, TASK_UPDATE.message);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const result = await db.delete(tasks)
    .where(eq(tasks.id, id));

  if (result.rowsAffected === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  return createDeleteResponse(c, TASK_DELETE.message);
};
