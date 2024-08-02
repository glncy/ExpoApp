import { useEffect, useState } from "react";

import { runSeeders } from "@/src/db/seeders";

export const useSeedersHooks = (isMigrationSuccess: boolean) => {
  const [seedersDidFinished, setSeedersDidFinished] = useState(false);
  const [seedersDidRunSuccess, setSeedersDidRunSuccess] = useState(false);

  const seedersHandler = async () => {
    try {
      await runSeeders();
      setSeedersDidFinished(true);
      setSeedersDidRunSuccess(true);
      console.log("[useSeedersHooks] Seeders did run successfully");
    } catch (e) {
      console.error("[useSeedersHooks] Seeders did run failed");
      console.error(e);
      setSeedersDidFinished(true);
      setSeedersDidRunSuccess(false);
    }
  };

  useEffect(() => {
    if (isMigrationSuccess) {
      seedersHandler();
    }
  }, [isMigrationSuccess]);

  return {
    seedersDidFinished,
    seedersDidRunSuccess,
  };
};
