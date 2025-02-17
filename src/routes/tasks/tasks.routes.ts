import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertTasksSchema, patchTasksSchema, selectTasksSchema } from "@/db/schema";
import { ZOD_ERROR_MESSAGES } from "@/lib/constants";
import { createCreateRoute, createDeleteRoute, createGetOneRoute, createListRoute, createUpdateRoute, unauthorizedErrorSchema } from "@/lib/crud-helper";

import { TASK_MESSAGES } from "./tasks.constants";
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
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      ZOD_ERROR_MESSAGES.UNAUTHORIZED,
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
      createCreateRoute(selectTasksSchema, TASK_MESSAGES.CREATE.message),
      TASK_MESSAGES.CREATE.message,
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      ZOD_ERROR_MESSAGES.UNAUTHORIZED,
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
      TASK_MESSAGES.GET_ONE.message,
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      taskNotFoundSchema,
      TASK_MESSAGES.NOT_FOUND.message,
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      ZOD_ERROR_MESSAGES.UNAUTHORIZED,
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
      TASK_MESSAGES.UPDATE.message,
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createUpdateRoute(selectTasksSchema, TASK_MESSAGES.UPDATE.message),
      TASK_MESSAGES.UPDATE.message,
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      taskNotFoundSchema,
      TASK_MESSAGES.NOT_FOUND.message,
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      ZOD_ERROR_MESSAGES.UNAUTHORIZED,
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
      createDeleteRoute(TASK_MESSAGES.DELETE.message),
      TASK_MESSAGES.DELETE.message,
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      taskNotFoundSchema,
      TASK_MESSAGES.NOT_FOUND.message,
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      ZOD_ERROR_MESSAGES.UNAUTHORIZED,
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
