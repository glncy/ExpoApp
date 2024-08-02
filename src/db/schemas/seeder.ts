import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const seeder = sqliteTable("seeders", {
  localId: int("localId").primaryKey({ autoIncrement: true }),
  name: text("name"),
});

export type Seeder = typeof seeder.$inferSelect;
export type InsertSeeder = typeof seeder.$inferInsert;
