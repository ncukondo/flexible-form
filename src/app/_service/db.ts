import { Prisma, PrismaClient } from "@prisma/client";

type RegisteredFormDefinition = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: Prisma.JsonValue;
  id_for_edit: string;
  id_for_extend: string;
  id_for_view: string;
  authorId: number | null;
};
type FormDefinitionForEdit = {
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: Prisma.JsonValue;
  id_for_edit: string;
  id_for_extend: string;
  id_for_view: string;
};
type FormDefinitionForView = {
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: Prisma.JsonValue;
  id_for_view: string;
};

export const prisma = new PrismaClient({
  log: ["query", "error", "info", "warn"],
});

export {
  type RegisteredFormDefinition,
  type FormDefinitionForEdit,
  type FormDefinitionForView,
  prisma as db,
};
