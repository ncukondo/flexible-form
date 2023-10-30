"use server";

import { revalidatePath } from "next/cache";
import { FormDefinition } from "../schema";
import { db, FormAccessRole } from "./db";
import { RegisteredFormDefinition } from "./types";
import { getUser } from "../../_service/user";
import { convertToClient, convertToServerId } from "./utils";
import { getFormEditorCondition } from "./utils";

export async function registerFormDefinition(schema: FormDefinition, source = "") {
  const title = schema.title;
  const { actions, ...form_definition } = schema;
  const user = await getUser();
  const values: RegisteredFormDefinition = await db.formDefinition.create({
    data: {
      title,
      actions,
      source,
      form_definition,
      permisions: { create: [{ email: user?.email ?? "", role: "ADMIN" }] },
    },
  });
  revalidatePath("/");
  return convertToClient(values, ["id", "id_for_edit", "id_for_view", "id_for_extend"] as const);
}

export async function updateFormDefinition(idForEdit: string, schema: FormDefinition, source = "") {
  const id_for_edit = convertToServerId(idForEdit);
  const title = schema.title;
  const { actions, ...form_definition } = schema;
  const user = await getUser();
  if (!user) throw new Error("User not found");
  const values = await db.formDefinition.update({
    ...getFormEditorCondition(id_for_edit, user.email),
    data: {
      title,
      actions,
      source,
      form_definition,
    },
  });
  revalidatePath("/");
  return values;
}

export async function updateFormDefinitionEditors(idForEdit: string, editorEmails: string[]) {
  const id_for_edit = convertToServerId(idForEdit);
  const user = await getUser();
  if (!user) throw new Error("User not found");
  const currentEditors = (
    await db.formDefinition.findUniqueOrThrow({
      ...getFormEditorCondition(id_for_edit, user.email),
      select: {
        permisions: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    })
  ).permisions;
  const editorsToDelete = currentEditors.filter(
    editor => editor.role !== FormAccessRole.ADMIN && !editorEmails.includes(editor.email),
  );
  const editorsToAdd = editorEmails.filter(
    email => !currentEditors.some(editor => editor.email === email),
  );
  const values = (
    await db.formDefinition.update({
      ...getFormEditorCondition(id_for_edit, user.email),
      data: {
        permisions: {
          deleteMany: editorsToDelete,
          create: editorsToAdd.map(email => ({ email, role: FormAccessRole.EDITOR })),
        },
      },
      select: {
        permisions: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    })
  ).permisions;
  revalidatePath("/");
  return values;
}

export type { RegisteredFormDefinition };
