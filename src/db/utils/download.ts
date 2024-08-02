import { eq, getTableColumns } from "drizzle-orm";

import { db } from "../";

import { InsertDownload, download } from "@/src/db/schema";

const allColumns = getTableColumns(download);

export const insertDownload = async (newDownload: InsertDownload) => {
  const [result] = await db
    .insert(download)
    .values(newDownload)
    .returning(allColumns);
  return result;
};

export const deleteDownloadByLocalId = async (localId: number) => {
  const [result] = await db
    .delete(download)
    .where(eq(download.localId, localId))
    .returning(allColumns);
  return result;
};
