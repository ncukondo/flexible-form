import { expect, test, describe } from "vitest";
import { flattenObject, unFlattenObject } from "../flatten-object";

describe("flatten-object", () => {
  test("flatten array", () => {
    const res1 = flattenObject({ a: ["1", "2"] });
    expect(res1).toStrictEqual({ "a.0": "1", "a.1": "2" });
  });

  test("flatten object", () => {
    const res1 = flattenObject({ a: { b: "1", c: "2" } });
    expect(res1).toStrictEqual({ "a.b": "1", "a.c": "2" });
  });

  test("flatten nested object", () => {
    const res1 = flattenObject({ a: { b: { c: "1" } } });
    expect(res1).toStrictEqual({ "a.b.c": "1" });
  });

  test("flatten nested object and array", () => {
    const res1 = flattenObject({ a: { b: ["1", "2"] } });
    expect(res1).toStrictEqual({ "a.b.0": "1", "a.b.1": "2" });
  });
});

describe("unflatten-object", () => {
  test("unflatten array", () => {
    const res1 = unFlattenObject({ "a.0": "1", "a.1": "2" });
    expect(res1).toStrictEqual({ a: ["1", "2"] });
  });

  test("unflatten object", () => {
    const res1 = unFlattenObject({ "a.b": "1", "a.c": "2" });
    expect(res1).toStrictEqual({ a: { b: "1", c: "2" } });
  });

  test("unflatten nested object", () => {
    const res1 = unFlattenObject({ "a.b.c": "1" });
    expect(res1).toStrictEqual({ a: { b: { c: "1" } } });
  });

  test("unflatten nested object and array", () => {
    const res1 = unFlattenObject({ "a.b.0": "1", "a.b.1": "2" });
    expect(res1).toStrictEqual({ a: { b: ["1", "2"] } });
  });
});

const testData = {
  param1: "value1",
  param2: ["value2", "value3"],
  param3: undefined,
  "param4.key1": "value4",
  "param4.key2.subKey1": "value5",
  "param4.key2.subKey2": "value5",
  "param4.key3": undefined,
  "param5.2.key1": "value6",
  "param5.1.key2": "value7",
};

const parsedData = {
  param1: "value1",
  param2: ["value2", "value3"],
  param4: { key1: "value4", key2: { subKey1: "value5", subKey2: "value5" } },
  param5: [{ key2: "value7" }, { key1: "value6" }],
} as const;

const reversedData = {
  param1: "value1",
  "param2.0": "value2",
  "param2.1": "value3",
  "param4.key1": "value4",
  "param4.key2.subKey1": "value5",
  "param4.key2.subKey2": "value5",
  "param5.1.key1": "value6",
  "param5.0.key2": "value7",
};

test("urlParamToObject", () => {
  const res = unFlattenObject(testData);
  expect(res).toStrictEqual(parsedData);
});

test("objectToUrlParam", () => {
  const res = flattenObject(parsedData);
  expect(res).toStrictEqual(reversedData);
});
