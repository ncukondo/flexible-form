"use server";

import { revalidatePath } from "next/cache";
import { FormDefinition } from "./form-definition-schema";
import { Prisma, PrismaClient } from "@prisma/client";

type RegisteredFormDefinition = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: Prisma.JsonValue;
  edit_id: string;
  limited_edit_id: string;
  view_id: string;
  authorId: number | null;
}

const prisma = new PrismaClient({
  log: ["query", "error", "info", "warn"],
})

export async function registerFormDefinition(schema: FormDefinition) {
  const title = schema.title;
  const values: RegisteredFormDefinition = await prisma.formDefinition.create({
    data: {
      title,
      content: schema
    }
  })
  revalidatePath("/");
  return values;
}

export async function updateFormDefinition(id: string, schema: FormDefinition) {
  const title = schema.title;
  const values = await prisma.formDefinition.update({
    where: {
      id
    },
    data: {
      title,
      content: schema
    }
  })
  revalidatePath("/");
  return values;
}


export type { RegisteredFormDefinition }