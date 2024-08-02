import { db } from "@/src/db";

export type TransactionType =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0];
