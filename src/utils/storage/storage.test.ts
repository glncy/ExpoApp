import { faker } from "@faker-js/faker";

import {
  load,
  loadString,
  save,
  saveString,
  clear,
  remove,
  storage,
} from "./storage";

// fixtures
const FAKE_KEY = faker.string.alpha(10);
const FAKE_VALUE = {
  [faker.string.alpha(10)]: faker.string.alpha(10),
  [faker.string.alpha(10)]: faker.string.alpha(10),
};
const FAKE_VALUE_STRING = JSON.stringify(FAKE_VALUE);

beforeEach(() => storage.set(FAKE_KEY, FAKE_VALUE_STRING));

test("load", () => {
  const value = load(FAKE_KEY);
  expect(value).toEqual(FAKE_VALUE);
});

test("loadString", () => {
  const value = loadString(FAKE_KEY);
  expect(value).toEqual(FAKE_VALUE_STRING);
});

test("save", () => {
  save(FAKE_KEY, FAKE_VALUE);

  const value = storage.getString(FAKE_KEY);
  expect(value).toEqual(FAKE_VALUE_STRING);
});

test("saveString", () => {
  saveString(FAKE_KEY, FAKE_VALUE_STRING);

  const value = storage.getString(FAKE_KEY);
  expect(value).toEqual(FAKE_VALUE_STRING);
});

test("remove", () => {
  remove(FAKE_KEY);

  const value = storage.getString(FAKE_KEY);
  expect(value).toEqual(undefined);
});

test("clear", () => {
  clear();

  const value = storage.getString(FAKE_KEY);
  expect(value).toEqual(undefined);
});
