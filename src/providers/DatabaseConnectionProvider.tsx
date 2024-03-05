import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { createContext, useContext } from "react";
import { Platform } from "react-native";

import { db } from "@/src/db";
import migrations from "@/src/db/migrations/migrations";

const DatabaseConnectionContext = createContext<{
  isMigrationsSuccess: boolean;
}>({
  isMigrationsSuccess: false,
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { success } = useMigrations(db, migrations);

  if (!success) return null;

  return (
    <DatabaseConnectionContext.Provider
      value={{
        isMigrationsSuccess: success,
      }}
    >
      {children}
    </DatabaseConnectionContext.Provider>
  );
};

export const DatabaseConnectionProvider = Platform.select({
  web: ({ children }: { children: React.ReactNode }) => (
    <DatabaseConnectionContext.Provider
      value={{
        isMigrationsSuccess: true,
      }}
    >
      {children}
    </DatabaseConnectionContext.Provider>
  ),
  default: Provider,
});

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext);
  return context;
}
