import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertTasksSchema, patchTasksSchema, selectTasksSchema } from "@/db/schema";
import { createCreateRoute, createDeleteRoute, createGetOneRoute, createListRoute, createUpdateRoute } from "@/lib/crud-helper";

import { TASK_CREATE, TASK_DELETE, TASK_GET_ONE, TASK_UPDATE, ZOD_ERROR_TASK_NOT_FOUND } from "./tasks.constants";
import { listQuerySchema, taskNotFoundSchema } from "./tasks.schema";

const tags = ["Tasks"];

export const list = createRoute({
  tags,
  path: "/tasks",
  method: "get",
  request: {
    query: listQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createListRoute(selectTasksSchema),
      "List of tasks",
    ),
  },
});

export const create = createRoute({
  tags,
  path: "/tasks",
  method: "post",
  request: {
    body: jsonContentRequired(insertTasksSchema, "The task to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      createCreateRoute(selectTasksSchema, TASK_CREATE.message),
      TASK_CREATE.message,
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTasksSchema),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  path: "/tasks/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createGetOneRoute(selectTasksSchema),
      TASK_GET_ONE.message,
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      taskNotFoundSchema,
      ZOD_ERROR_TASK_NOT_FOUND.message,
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: "/tasks/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchTasksSchema,
      TASK_UPDATE.message,
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createUpdateRoute(selectTasksSchema, TASK_UPDATE.message),
      TASK_UPDATE.message,
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      taskNotFoundSchema,
      ZOD_ERROR_TASK_NOT_FOUND.message,
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchTasksSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/tasks/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.ACCEPTED]: jsonContent(
      createDeleteRoute(TASK_DELETE.message),
      TASK_DELETE.message,
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      taskNotFoundSchema,
      ZOD_ERROR_TASK_NOT_FOUND.message,
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
