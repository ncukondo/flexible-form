import { FormAccessRole } from "@prisma/client";
import { toShortUUID, toUUID } from "./uuid";

const convertFormat = <
  Keys extends readonly string[],
  Dict extends Record<Keys[number], string> & Record<string, unknown>,
>(
  obj: Dict,
  keys: Keys,
  formatter: (source: string) => string,
) => {
  const result = {} as Record<string, unknown>;
  for (const key of keys) {
    result[key] = formatter(obj[key] as string);
  }
  return { ...obj, ...result } as Dict;
};

const convertToClientId = (id: string) => toShortUUID(id);

export const convertToClient = <
  Keys extends readonly string[],
  Dict extends Record<Keys[number], string> & Record<string, unknown>,
>(
  obj: Dict,
  keys: Keys,
) => convertFormat(obj, keys, (source: string) => convertToClientId(source));

export const convertToServerId = (id: string) => toUUID(id);

export const convertToServer = <
  Keys extends readonly string[],
  Dict extends Record<Keys[number], string> & Record<string, unknown>,
>(
  obj: Dict,
  keys: Keys,
) => convertFormat(obj, keys, (source: string) => convertToServerId(source));

export const getFormEditorCondition = (id_for_edit: string, userEmail: string) => ({
  where: {
    id_for_edit,
    OR: [
      { permisions: { some: { email: userEmail, role: FormAccessRole.ADMIN } } },
      { permisions: { some: { email: userEmail, role: FormAccessRole.EDITOR } } },
    ],
  },
});

export const excludeFields = <
  Models extends { fields: object },
  T extends Models["fields"],
  ExcludeT extends (keyof T)[],
>(
  model: Models,
  exclude: ExcludeT,
) => {
  const fields = model.fields;
  const keys = Object.keys(fields) as (keyof T)[];
  const excludeSet = new Set(exclude);
  const attributes: Partial<Record<keyof T[][number], boolean>> = {};
  for (const key of keys) {
    if (excludeSet.has(key)) attributes[key] = false;
    else attributes[key] = true;
  }

  type IncludeType = {
    [K in keyof T]: true;
  };
  type Result = Omit<IncludeType, ExcludeT[number]>;
  return attributes as Result;
};
