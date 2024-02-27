import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const download = sqliteTable("downloads", {
  localId: int("localId").primaryKey({ autoIncrement: true }),
  url: text("url"),
  fileName: text("fileName"),
});

export type SelectDownload = typeof download.$inferSelect;
export type InsertDownload = typeof download.$inferInsert;
