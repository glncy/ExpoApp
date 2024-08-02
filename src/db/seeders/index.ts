import { asc } from "drizzle-orm";

import { db } from "@/src/db";
import { seeder } from "@/src/db/schema";
import { x0001_seed_sample } from "@/src/db/seeders/x0001_seed_sample";

export const seedList = {
  // seeder file and function name convention `x000<number>_seed_<name>`
  x0001_seed_sample,
};

export const runSeeders = async () => {
  const runSeeds = await db.query.seeder.findMany({
    orderBy: [asc(seeder.localId)],
  });
  await db.transaction(async (tx) => {
    try {
      const keys = Object.keys(seedList) as (keyof typeof seedList)[];
      for await (const key of keys) {
        if (runSeeds.some((s) => s.name === key)) {
          console.log(`[db/seeders] Seeder ${key} already exists`);
          continue;
        }
        await seedList[key](tx);
        await tx.insert(seeder).values({ name: key });
        console.log(`[db/seeders] Seeder ${key} successfully run`);
      }
    } catch (e) {
      console.error("[db/seeders] Error running seeders");
      console.error(e);
      await tx.rollback();
    }
  });
};
