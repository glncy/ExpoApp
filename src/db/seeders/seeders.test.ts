import { Table, asc, is, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { getTableConfig } from "drizzle-orm/sqlite-core";

import drizzleConfig from "@/drizzle.config";
import { db } from "@/src/db";
import * as schemas from "@/src/db/schema";
import { runSeeders, seedList } from "@/src/db/seeders";

jest.mock("@/src/db");

const mockDb = jest.requireMock("../").db;

const targetModel = schemas.seeder;
const targetModelConfig = getTableConfig(targetModel);

const schemasKey = Object.keys(schemas) as (keyof typeof schemas)[];
const models = schemasKey
  .filter((key) => key !== targetModelConfig.name)
  .map((key) => {
    if (is(schemas[key], Table)) {
      return schemas[key];
    }
    return null;
  })
  .filter((table) => table !== null);

beforeAll(async () => {
  // migrate the database
  await migrate(mockDb, { migrationsFolder: drizzleConfig.out });
  for await (const model of models) {
    const modelConfig = getTableConfig(model);
    await mockDb.delete(model);
    // restart id sequence
    await mockDb.run(
      sql.raw(`DELETE FROM sqlite_sequence WHERE name='${modelConfig.name}'`)
    );
  }
});

afterAll(async () => {
  // restart id sequence
  await mockDb.delete(targetModel);
  await mockDb.run(
    sql.raw(
      `DELETE FROM sqlite_sequence WHERE name='${targetModelConfig.name}'`
    )
  );
});

test("test seeder if running correctly", async () => {
  await runSeeders();
  const seedersList = Object.keys(seedList) as (keyof typeof seedList)[];
  const result = await db.query.seeder.findMany({
    orderBy: [asc(targetModel.localId)],
  });
  const seedersResult = result.map((r) => r.name);
  expect(seedersResult).toEqual(seedersList);
});
