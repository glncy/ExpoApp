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
const VALUE_OBJECT = { x: 1 };
const VALUE_STRING = JSON.stringify(VALUE_OBJECT);

beforeEach(() =>
  (storage.getString as jest.Mock).mockReturnValue(
    Promise.resolve(VALUE_STRING)
  )
);
afterEach(() => jest.clearAllMocks());

test("load", async () => {
  const value = await load("something");
  expect(value).toEqual(JSON.parse(VALUE_STRING));
});

test("loadString", async () => {
  const value = await loadString("something");
  expect(value).toEqual(VALUE_STRING);
});

test("save", async () => {
  await save("something", VALUE_OBJECT);
  expect(storage.set).toHaveBeenCalledWith("something", VALUE_STRING);
});

test("saveString", async () => {
  await saveString("something", VALUE_STRING);
  expect(storage.set).toHaveBeenCalledWith("something", VALUE_STRING);
});

test("remove", async () => {
  await remove("something");
  expect(storage.delete).toHaveBeenCalledWith("something");
});

test("clear", async () => {
  await clear();
  expect(storage.clearAll).toHaveBeenCalledWith();
});
