alter table "public"."FormDefinition" drop column "createdAt";

alter table "public"."FormDefinition" drop column "updatedAt";

alter table "public"."FormDefinition" add column "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP;

alter table "public"."FormDefinition" add column "updated_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP;
