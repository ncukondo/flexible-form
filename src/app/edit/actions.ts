"use server";

import { revalidatePath } from "next/cache";
import { FormDefinition } from "./form-definition-schema";
import { RegisteredFormDefinition, db } from "@service/db";
import { getUser } from "@service/user";

export async function registerFormDefinition(schema: FormDefinition, source = "") {
  const title = schema.title;
  const actions = schema.actions;
  const author_uid = (await getUser())?.sub ?? null;
  const values: RegisteredFormDefinition = await db.formDefinition.create({
    data: {
      title,
      actions,
      source,
      author_uid,
      form_definition: schema,
    },
  });
  revalidatePath("/");
  return values;
}

export async function updateFormDefinition(
  id_for_edit: string,
  schema: FormDefinition,
  source = "",
) {
  const title = schema.title;
  const actions = schema.actions;
  const values = await db.formDefinition.update({
    where: {
      id_for_edit,
    },
    data: {
      title,
      actions,
      source,
      form_definition: schema,
    },
  });
  revalidatePath("/");
  return values;
}

export type { RegisteredFormDefinition };
