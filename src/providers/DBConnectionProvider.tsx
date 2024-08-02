import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { createContext, useContext } from "react";
import { Platform } from "react-native";

import { db } from "@/src/db";
import migrations from "@/src/db/migrations/migrations";
import { useSeedersHooks } from "@/src/db/seeders/useSeedersHooks";

const DBConnectionCtx = createContext<{
  isMigrationsSuccess: boolean;
  isSeedersSuccess: boolean;
}>({
  isMigrationsSuccess: false,
  isSeedersSuccess: false,
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { success: migrationDidRunSuccess } = useMigrations(db, migrations);
  const { seedersDidRunSuccess } = useSeedersHooks(migrationDidRunSuccess);

  if (!migrationDidRunSuccess && !seedersDidRunSuccess) return null;

  return (
    <DBConnectionCtx.Provider
      value={{
        isMigrationsSuccess: migrationDidRunSuccess,
        isSeedersSuccess: seedersDidRunSuccess,
      }}
    >
      {children}
    </DBConnectionCtx.Provider>
  );
};

export const DBConnectionProvider = Platform.select({
  web: ({ children }: { children: React.ReactNode }) => (
    <DBConnectionCtx.Provider
      value={{
        isMigrationsSuccess: true,
        isSeedersSuccess: true,
      }}
    >
      {children}
    </DBConnectionCtx.Provider>
  ),
  default: Provider,
});

export function useDBConnectionCtx() {
  const context = useContext(DBConnectionCtx);
  return context;
}
