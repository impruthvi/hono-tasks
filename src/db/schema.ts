import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = sqliteTable("tasks", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  name: text("name")
    .notNull(),
  done: integer("done", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const selectTasksSchema = createSelectSchema(tasks);

export const insertTasksSchema = createInsertSchema(
  tasks,
  {
    name: schema => schema
      .min(1, { message: "Name must be at least 1 character long" })
      .max(500, { message: "Name must be at most 500 characters long" }),
  },
)
  .required({
    done: true
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    done: z.boolean({
      required_error: "Done status is required",
      invalid_type_error: "Done must be a boolean value"
    })
  });
export const patchTasksSchema = insertTasksSchema.partial();
