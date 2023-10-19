alter table "public"."FormDefinition" alter column "content" set data type json using "content"::json;

alter table "public"."FormDefinition" alter column "createdAt" set default now();

alter table "public"."FormDefinition" alter column "createdAt" set data type timestamp with time zone using "createdAt"::timestamp with time zone;

alter table "public"."FormDefinition" alter column "updatedAt" set data type timestamp with time zone using "updatedAt"::timestamp with time zone;


