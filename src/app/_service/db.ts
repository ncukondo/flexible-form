import { Prisma, PrismaClient } from "@prisma/client";

type RegisteredFormDefinition = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: Prisma.JsonValue;
  id_for_edit: string;
  id_for_extention: string;
  id_for_view: string;
  authorId: number | null;
};
export const prisma = new PrismaClient({
  log: ["query", "error", "info", "warn"],
});

export { type RegisteredFormDefinition, prisma as db };
