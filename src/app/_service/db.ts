import { Prisma, PrismaClient } from "@prisma/client";
import { getUserInServerActions } from "../auth/users";

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

const injectUsersToDBInServerActions = () => {
  return prisma.$extends({
    query: {
      // Enable the extension for all models
      $allModels: {
        // Enable the extension for all operations (CREATE, UPDATE, etc.)
        async $allOperations({ args, query }) {
          const user = await getUserInServerActions();
          const [, , result] = await prisma.$transaction([
            prisma.$executeRawUnsafe(`SET LOCAL request.jwt.claim.sub TO '${user?.id ?? ""}'`),
            prisma.$executeRawUnsafe(`SET LOCAL request.jwt.claim.email TO '${user?.email ?? ""}'`),
            query(args),
            prisma.$executeRawUnsafe("RESET request.jwt.claim.sub"),
            prisma.$executeRawUnsafe("RESET request.jwt.claim.email"),
          ]);
          return result;
        },
      },
    },
  });
};

export {
  type RegisteredFormDefinition,
  type FormDefinitionForEdit,
  type FormDefinitionForView,
  prisma as db,
  injectUsersToDBInServerActions,
};
