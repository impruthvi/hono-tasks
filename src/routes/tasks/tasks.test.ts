import { describe, expect, expectTypeOf, it } from "vitest";
import router from "./tasks.index";
import { createTestApp } from "@/lib/create-app";

describe("Tasks List", () => {
    it("response with an array", async () => {
        const testRouter = createTestApp(router);
        const response = await testRouter.request("/tasks");
        const result = await response.json();
        // @ts-expect-error
        expectTypeOf(result).toBeArray();
    })

})