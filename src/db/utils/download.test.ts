import { faker } from "@faker-js/faker";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { getTableConfig } from "drizzle-orm/sqlite-core";

import drizzleConfig from "@/drizzle.config";
import { db } from "@/src/db";
import * as schemas from "@/src/db/schema";
import * as utilFunctions from "@/src/db/utils/download";

jest.mock("@/src/db");

const mockDb = jest.requireMock("../").db;
const tableConfig = getTableConfig(schemas.download);

// types
type InsertModelType = schemas.InsertDownload;
type ModelType = schemas.SelectDownload;

// functions
const model = schemas.download;
const insertFunction = utilFunctions.insertDownload;
const deleteByLocalIdFunction = utilFunctions.deleteDownloadByLocalId;

// fakers
const testObjectArray: InsertModelType[] = [
  ...Array(faker.number.int({ min: 0, max: 50 })),
].map(() => ({
  fileName: faker.system.fileName(),
  url: faker.image.urlPlaceholder(),
}));

beforeAll(async () => {
  // migrate the database
  await migrate(mockDb, { migrationsFolder: drizzleConfig.out });
});

let resultSandbox: ModelType[] = [];
beforeEach(async () => {
  const allColumns = getTableColumns(model);
  resultSandbox = await db
    .insert(model)
    .values(testObjectArray)
    .returning(allColumns);
});

afterEach(async () => {
  await mockDb.delete(model);
});

afterAll(async () => {
  // restart id sequence
  await mockDb.run(
    sql.raw(`DELETE FROM sqlite_sequence WHERE name='${tableConfig.name}'`)
  );
});

describe("download utils", () => {
  it("test insertDownload", async () => {
    const testData: InsertModelType = {
      fileName: faker.system.fileName(),
      url: faker.image.urlPlaceholder(),
    };
    const newData = await insertFunction(testData);
    const retrievedData = await db.query.download.findFirst({
      where: eq(model.localId, newData.localId),
    });
    expect(retrievedData).toEqual({
      localId: newData.localId,
      ...testData,
    });
  });

  it("test deleteDownloadByLocalId", async () => {
    const testData =
      resultSandbox[
        faker.number.int({ min: 0, max: resultSandbox.length - 1 })
      ];
    const deletedData = await deleteByLocalIdFunction(testData.localId);
    expect(deletedData).toEqual(testData);
    const retrievedData = await db.query.download.findFirst({
      where: eq(model.localId, testData.localId),
    });
    expect(retrievedData).toBeUndefined();
  });
});
