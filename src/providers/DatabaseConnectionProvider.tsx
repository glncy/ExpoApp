import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { createContext, useContext } from "react";

import { db } from "@/src/db";
import migrations from "@/src/db/migrations/migrations";

const DatabaseConnectionContext = createContext<{
  isMigrationsSuccess: boolean;
}>({
  isMigrationsSuccess: false,
});

export const DatabaseConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext);
  return context;
}
