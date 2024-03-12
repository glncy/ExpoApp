import Dexie, { Table } from "dexie";

import { InsertDownload } from "@/src/db/schema";

export class SubClassedDexie extends Dexie {
  downloads!: Table<InsertDownload>;

  constructor(database: string) {
    super(database);
    this.version(1).stores({
      downloads: "++localId, url, fileName",
    });
  }
}
