import { InsertSeeder, seeder } from "@/src/db/schema";
import { TransactionType } from "@/src/db/types";

const seedSeeder: InsertSeeder[] = [
  // note: insert your seed data here
  // {}
];

export const x0001_seed_sample = async (tx: TransactionType) => {
  // note: run insert db function here
  // await tx.insert(seeder).values(seedSeeder);
};
