import { int } from "drizzle-orm/sqlite-core";

export const defaultTimestamps = {
  createdAt: int("createdAt", { mode: "timestamp" }).$default(() => new Date()),
  updatedAt: int("updatedAt", { mode: "timestamp" }).$default(() => new Date()),
};
