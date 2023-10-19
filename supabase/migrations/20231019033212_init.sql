create extension if not exists "moddatetime" with schema "extensions";


create table "public"."FormDefinition" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "title" text not null,
    "content" json not null,
    "author_id" uuid,
    "id_for_edit" uuid not null default gen_random_uuid(),
    "id_for_view" uuid not null default gen_random_uuid(),
    "id_for_extend" uuid not null default gen_random_uuid()
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


CREATE UNIQUE INDEX "FormDefinition_id_for_edit_key" ON public."FormDefinition" USING btree (id_for_edit);

CREATE UNIQUE INDEX "FormDefinition_id_for_extend_key" ON public."FormDefinition" USING btree (id_for_extend);

CREATE UNIQUE INDEX "FormDefinition_id_for_view_key" ON public."FormDefinition" USING btree (id_for_view);

CREATE UNIQUE INDEX "FormDefinition_pkey" ON public."FormDefinition" USING btree (id);

CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id);

alter table "public"."FormDefinition" add constraint "FormDefinition_pkey" PRIMARY KEY using index "FormDefinition_pkey";

alter table "public"."_prisma_migrations" add constraint "_prisma_migrations_pkey" PRIMARY KEY using index "_prisma_migrations_pkey";


