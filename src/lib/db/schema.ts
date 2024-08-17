import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  serial,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  schema: jsonb("schema").notNull(),
  published: boolean("published").default(false).notNull(),
  userId: text("user_id").notNull(),
});

export const formResponses = pgTable("form_responses", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  formId: integer("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  data: jsonb("data").notNull(),
});
