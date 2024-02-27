import { eq } from "drizzle-orm";

import { db } from "../";

import { InsertDownload, download } from "@/src/db/schema";

export const insertDownload = (newDownload: InsertDownload) =>
  db.insert(download).values(newDownload).returning({
    localId: download.localId,
    url: download.url,
    fileName: download.fileName,
  });

export const deleteDownloadById = (localId: number) =>
  db.delete(download).where(eq(download.localId, localId));
