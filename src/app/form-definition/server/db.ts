import { PrismaClient, FormAccessRole } from "@prisma/client";
import { getUser } from "../../_service/user";

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

export { db, FormAccessRole };
