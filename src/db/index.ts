import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";

import * as schema from "@/src/db/schema";

const expoDb = openDatabaseSync("localdb.db");
export const db = drizzle(expoDb, {
  schema,
});
