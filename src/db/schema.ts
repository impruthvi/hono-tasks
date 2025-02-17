import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// TASKS

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
    done: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    done: z.boolean({
      required_error: "Done status is required",
      invalid_type_error: "Done must be a boolean value",
    }),
  });
export const patchTasksSchema = insertTasksSchema.partial();

// USERS

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  email: text("email")
    .notNull()
    .unique(),
  password: text("password")
    .notNull(),
  role: text("role")
    .notNull()
    .default("user"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const selectUsersSchema = createSelectSchema(users);

export const selectUsersSchemaWithoutPassword = selectUsersSchema.omit({
  password: true,
});

export const insertUsersSchema = createInsertSchema(users, {
  email: schema => schema
    .email({ message: "Invalid email format" }),
  password: schema => schema
    .min(8, { message: "Password must be at least 8 characters long" }),
  role: schema => schema
    .min(1, { message: "Role must be at least 1 character long" })
    .max(50, { message: "Role must be at most 50 characters long" }),
})
  .required({
    role: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const loginUsersSchema = createInsertSchema(users, {
  email: schema => schema
    .email({ message: "Invalid email format" }),
  password: schema => schema
    .min(8, { message: "Password must be at least 8 characters long" }),
})

  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    role: true,
  });

export type User = z.infer<typeof selectUsersSchema>;
