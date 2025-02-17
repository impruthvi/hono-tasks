/* eslint-disable ts/ban-ts-comment */
import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { ZodIssueCode } from "zod";

import env from "@/env";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import createApp from "@/lib/create-app";
import authRouter from "@/routes/authentication/auth.index";

import { TASK_MESSAGES } from "./tasks.constants";
import router from "./tasks.index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route("/", router));
const authClient = testClient(createApp().route("/", authRouter));
let authToken: string | null = null;

describe("tasks routes", () => {
  beforeAll(async () => {
    execSync("bun drizzle-kit push");

    const registerResponse = await authClient.register.$post({
      json: {
        email: "test@example.com",
        password: "password123",
        role: "user",
      },
    });

    if (registerResponse.status !== 201) {
      throw new Error("Failed to register user");
    }

    const data = await registerResponse.json();

    if (registerResponse.status === 201) {
      authToken = data && data.meta.token;
    }
  });

  afterAll(async () => {
    fs.rmSync("test.db", { force: true });
  });

  it("post /tasks validates the body when creating", async () => {
    const response = await client.tasks.$post({
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      // @ts-expect-error
      json: {
        done: false,
      },
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("name");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
    }
  });

  const id = 1;
  const name = "Learn vitest";

  it("post /tasks creates a task", async () => {
    const response = await client.tasks.$post({
      json: {
        name,
        done: false,
      },
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.status).toBe(201);
    if (response.status === 201) {
      const json = await response.json();
      expect(json.data.name).toBe(name);
      expect(json.data.done).toBe(false);
    }
  });

  it("get /tasks lists all tasks", async () => {
    const response = await client.tasks.$get({
      query: {
        limit: 10,
        offset: 0,
      },
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expectTypeOf(json.data).toBeArray();
      expect(json.data.length).toBe(1);
    }
  });

  it("get /tasks/{id} validates the id param", async () => {
    const response = await client.tasks[":id"].$get({
      param: {
        // @ts-expect-error
        id: "wat",
      },
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("get /tasks/{id} returns 404 when task not found", async () => {
    const response = await client.tasks[":id"].$get({
      param: {
        id: 1000,
      },
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.error.issues[0].message).toBe(TASK_MESSAGES.NOT_FOUND.message);
    }
  });

  it("get /tasks/{id} gets a single task", async () => {
    const response = await client.tasks[":id"].$get({
      param: {
        id,
      },
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.data.name).toBe(name);
      expect(json.data.done).toBe(false);
    }
  });

  it("patch /tasks/{id} validates the body when updating", async () => {
    const response = await client.tasks[":id"].$patch({
      param: {
        id,
      },
      json: {
        name: "",
      },
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("name");
      expect(json.error.issues[0].code).toBe(ZodIssueCode.too_small);
    }
  });

  it("patch /tasks/{id} validates the id param", async () => {
    const response = await client.tasks[":id"].$patch({
      param: {
        // @ts-expect-error
        id: "wat",
      },
      json: {},
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("patch /tasks/{id} validates empty body", async () => {
    const response = await client.tasks[":id"].$patch({
      param: {
        id,
      },
      json: {},
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES);
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.NO_UPDATES);
    }
  });

  it("patch /tasks/{id} updates a single property of a task", async () => {
    const response = await client.tasks[":id"].$patch({
      param: {
        id,
      },
      json: {
        done: true,
      },
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.data.done).toBe(true);
    }
  });

  it("delete /tasks/{id} validates the id when deleting", async () => {
    const response = await client.tasks[":id"].$delete({
      param: {
        // @ts-expect-error
        id: "wat",
      },
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("delete /tasks/{id} removes a task", async () => {
    const response = await client.tasks[":id"].$delete({
      param: {
        id,
      },
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.status).toBe(202);
  });
});
