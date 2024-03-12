import { ExpoSQLiteDatabase, drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import { Platform } from "react-native";

import { SubClassedDexie } from "@/src/db/dexie";
import * as schema from "@/src/db/schema";

const name = "localdb.db";

export let db: ExpoSQLiteDatabase<typeof schema>;
export const dexie = new SubClassedDexie(name);

if (Platform.OS !== "web") {
  const expoDb = openDatabaseSync(name);
  db = drizzle(expoDb, {
    schema,
  });
}
