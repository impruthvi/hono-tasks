import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

import env from "@/env";

config({ path: ".env" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,

  },
});
