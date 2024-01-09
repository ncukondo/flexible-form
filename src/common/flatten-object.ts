/**
 * UrlSearchParams cannot store nested objects and may contain undefined values.
 * This library makes it possible to store nested objects without
 * undefined values in UrlSearchParams.
 *
 * This library uses "." as a delimiter to store nested objects.
 * Arrays are delimited by index (e.g. {key:["value1","value2"]} is stored as
 * key.1=value1&key.2=value).
 *
 */

type ParamObject = {
  [key: string]: string | readonly string[] | ParamObject | readonly ParamObject[];
};
type ParamObjectWithUndefined = {
  [key: string]:
  | string
  | readonly (string | undefined)[]
  | ParamObjectWithUndefined
  | readonly (ParamObjectWithUndefined | undefined)[];
};
type ParamObjectWithUndefinedValue = ParamObjectWithUndefined[keyof ParamObjectWithUndefined];

const splitter = ".";

const sanitizeData = (data: { [key: string]: string | string[] | undefined }) => {
  const filterUndefinedEntry = (
    entry: [string, string | string[] | undefined],
  ): entry is [string, string | string[]] => {
    return entry[1] !== undefined;
  };
  const sanitized = Object.fromEntries(
    Object.entries(data)
      .filter(filterUndefinedEntry)
      .flatMap(([k, v]) => {
        if (Array.isArray(v)) {
          return v.map((e, i) => [`${k}${splitter}${i}`, e]);
        }
        return [[k, v]];
      }),
  );
  return sanitized;
};

const removeUndefinedInArray = (obj: ParamObjectWithUndefined) => {
  const filterUndefined = (
    v: ParamObjectWithUndefinedValue | undefined | string,
  ): v is ParamObject | string => v !== undefined;
  const removeUndefined = (
    obj: ParamObjectWithUndefined | readonly string[] | readonly ParamObject[] | string | undefined,
  ): ParamObject | string | readonly string[] | ParamObject[] => {
    if (typeof obj === "string") {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.filter(filterUndefined).map(e => removeUndefined(e)) as ParamObject[];
    }
    return Object.fromEntries(
      Object.entries(obj as ParamObjectWithUndefined).flatMap(([k, v]) => {
        if (v === undefined) return [];
        if (typeof v === "string") {
          return [[k, v]];
        }
        return [[k, removeUndefined(v as ParamObject)]];
      }),
    );
  };
  return removeUndefined(obj) as ParamObject;
};

const unFlattenObject = (param: { [key: string]: string | string[] | undefined }) => {
  const sanitized = sanitizeData(param);
  const merge = (
    obj: ParamObject,
    currentKey: string | number,
    restKeys: (string | number)[],
    value: string,
  ) => {
    if (restKeys.length === 0) {
      obj[currentKey] = value;
      return obj;
    }
    const [nextKey, ...rest] = restKeys;
    if (typeof nextKey === "number") {
      obj[currentKey] = obj[currentKey] ?? [];
    } else {
      obj[currentKey] = obj[currentKey] ?? {};
    }
    obj[currentKey] = merge(obj[currentKey] as ParamObject, nextKey, rest, value);
    return obj;
  };
  return removeUndefinedInArray(
    Object.entries(sanitized).reduce((prev, [k, v]) => {
      const keys = k.split(splitter).map(e => (e.match(/^\d+$/) ? Number(e) : e));
      return merge(prev, keys[0], keys.slice(1), v as string);
    }, {} as ParamObject),
  );
};

const flattenObject = (obj: ParamObject) => {
  const flatten = (
    obj: ParamObject | readonly string[] | readonly ParamObject[],
    parentKey: string,
  ): [string, string][] => {
    return Object.entries(obj).flatMap(([k, v]) => {
      if (!v) return [];
      const key = parentKey ? `${parentKey}${splitter}${k}` : k;
      if (typeof v === "string") {
        return [[key, v]];
      }
      return flatten(v, key);
    });
  };
  return Object.fromEntries(flatten(obj, ""));
};

export { flattenObject, unFlattenObject, type ParamObject };
