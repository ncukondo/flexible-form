alter table "public"."FormDefinition" drop column "content";

alter table "public"."FormDefinition" add column "actions" text[];

alter table "public"."FormDefinition" add column "form_definition" json not null;


