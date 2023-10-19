-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateSchema


CREATE SCHEMA IF NOT EXISTS "extensions";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS moddatetime WITH SCHEMA extensions;

CREATE SCHEMA IF NOT EXISTS "graphql";

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA extensions;

CREATE SCHEMA IF NOT EXISTS "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA pgsodium;


CREATE SCHEMA IF NOT EXISTS "vault";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA vault;



-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";




-- AddForeignKey
ALTER TABLE "public"."FormDefinition" ADD CONSTRAINT "FormDefinition_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

