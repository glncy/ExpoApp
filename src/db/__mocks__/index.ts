import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { SubClassedDexie } from "../dexie";
import * as schema from "../schema";

export const testDbName = ".unit-test-db";

const sqlite = new Database(testDbName);

export const db = drizzle(sqlite, {
  schema,
});

export const dexie = new SubClassedDexie(testDbName);
