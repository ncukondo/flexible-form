import { expect, test } from "vitest";
import { urlParamToObject, objectToUrlParam } from "../search-param-to-object";

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
  const res = urlParamToObject(testData);
  expect(res).toStrictEqual(parsedData);
});

test("objectToUrlParam", () => {
  const res = objectToUrlParam(parsedData);
  expect(res).toStrictEqual(reversedData);
});
