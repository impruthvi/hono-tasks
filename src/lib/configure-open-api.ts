import { apiReference } from "@scalar/hono-api-reference";

import type { AppOpenApi } from "@/lib/types";

import packageJson from "../../package.json";

export default function configureOpenApi(app: AppOpenApi) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "Tasks API",
      version: packageJson.version,
    },
  });

  app.get(
    "/reference",
    apiReference({
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "node",
        clientKey: "axios",
      },
      spec: {
        url: "/doc",
      },
    }),
  );
}
