"use server";

import { revalidatePath } from "next/cache";
import { FormDefinition } from "./form-definition-schema";
import { RegisteredFormDefinition, injectUsersToDBInServerActions } from "@service/db";

export async function registerFormDefinition(schema: FormDefinition) {
  injectUsersToDBInServerActions();
  const title = schema.title;
  const actions = schema.actions;
  const values: RegisteredFormDefinition =
    await injectUsersToDBInServerActions().formDefinition.create({
      data: {
        title,
        actions,
        form_definition: schema,
      },
    });
  revalidatePath("/");
  return values;
}

export async function updateFormDefinition(id_for_edit: string, schema: FormDefinition) {
  const title = schema.title;
  const actions = schema.actions;
  const values = await injectUsersToDBInServerActions().formDefinition.update({
    where: {
      id_for_edit,
    },
    data: {
      title,
      actions,
      form_definition: schema,
    },
  });
  revalidatePath("/");
  return values;
}

export type { RegisteredFormDefinition };
