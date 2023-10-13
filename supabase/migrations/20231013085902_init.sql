create sequence "public"."User_id_seq";

create table "public"."FormDefinition" (
    "id" text not null default gen_random_uuid(),
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null,
    "title" text not null,
    "content" jsonb not null,
    "edit_id" text not null default gen_random_uuid(),
    "limited_edit_id" text not null default gen_random_uuid(),
    "view_id" text not null default gen_random_uuid(),
    "authorId" integer
);


create table "public"."User" (
    "id" integer not null default nextval('"User_id_seq"'::regclass),
    "email" text not null,
    "name" text
);


create table "public"."_prisma_migrations" (
    "id" character varying(36) not null,
    "checksum" character varying(64) not null,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) not null,
    "logs" text,
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone not null default now(),
    "applied_steps_count" integer not null default 0
);


alter sequence "public"."User_id_seq" owned by "public"."User"."id";

CREATE UNIQUE INDEX "FormDefinition_pkey" ON public."FormDefinition" USING btree (id);

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);

CREATE UNIQUE INDEX "User_pkey" ON public."User" USING btree (id);

CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id);

alter table "public"."FormDefinition" add constraint "FormDefinition_pkey" PRIMARY KEY using index "FormDefinition_pkey";

alter table "public"."User" add constraint "User_pkey" PRIMARY KEY using index "User_pkey";

alter table "public"."_prisma_migrations" add constraint "_prisma_migrations_pkey" PRIMARY KEY using index "_prisma_migrations_pkey";

alter table "public"."FormDefinition" add constraint "FormDefinition_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."FormDefinition" validate constraint "FormDefinition_authorId_fkey";


