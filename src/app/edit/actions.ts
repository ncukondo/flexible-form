"use server";

import { revalidatePath } from "next/cache";
import { FormDefinition } from "./form-definition-schema";
import { RegisteredFormDefinition } from "@service/db";
import { db } from "@service/db";

export async function registerFormDefinition(schema: FormDefinition) {
  const title = schema.title;
  const values: RegisteredFormDefinition = await db.formDefinition.create({
    data: {
      title,
      content: schema,
    },
  });
  revalidatePath("/");
  return values;
}

export async function updateFormDefinition(id: string, schema: FormDefinition) {
  const title = schema.title;
  const values = await db.formDefinition.update({
    where: {
      id,
    },
    data: {
      title,
      content: schema,
    },
  });
  revalidatePath("/");
  return values;
}

export type { RegisteredFormDefinition };
