import { Prisma, PrismaClient } from "@prisma/client";
import { getUser } from "./user";

type RegisteredFormDefinition = {
  id: string;
  created_at: Date;
  updated_at: Date;
  title: string;
  source: string;
  actions: string[];
  form_definition: Prisma.JsonValue;
  author_uid: string | null;
  id_for_edit: string;
  id_for_view: string;
  id_for_extend: string;
};
type FormDefinitionForEdit = {
  created_at: Date;
  updated_at: Date;
  title: string;
  source: string;
  form_definition: Prisma.JsonValue;
  id_for_edit: string;
  id_for_extend: string;
  id_for_view: string;
};
type FormDefinitionForView = {
  created_at: Date;
  updated_at: Date;
  title: string;
  form_definition: Prisma.JsonValue;
  id_for_view: string;
};

export const prisma = new PrismaClient({
  log: ["query", "error", "info", "warn"],
});

const injectUsers = (prisma: PrismaClient) => {
  return prisma.$extends({
    query: {
      // Enable the extension for all models
      $allModels: {
        // Enable the extension for all operations (CREATE, UPDATE, etc.)
        async $allOperations({ args, query }) {
          const user = await getUser();
          const json = user ? JSON.stringify(user) : "";
          const [, result] = await prisma.$transaction([
            prisma.$executeRawUnsafe(`
              SELECT set_config('request.jwt.claim','${json}',true);`),
            query(args),
          ]);
          return result;
        },
      },
    },
  });
};

const db = injectUsers(prisma);

export {
  type RegisteredFormDefinition,
  type FormDefinitionForEdit,
  type FormDefinitionForView,
  db,
};
