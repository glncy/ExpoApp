import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { createContext, useContext } from "react";
import { Platform } from "react-native";

import { db } from "@/src/db";
import migrations from "@/src/db/migrations/migrations";

const DBConnectionCtx = createContext<{
  isMigrationsSuccess: boolean;
}>({
  isMigrationsSuccess: false,
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { success } = useMigrations(db, migrations);

  if (!success) return null;

  return (
    <DBConnectionCtx.Provider
      value={{
        isMigrationsSuccess: success,
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
