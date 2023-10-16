alter table "public"."FormDefinition" drop column "edit_id";

alter table "public"."FormDefinition" drop column "limited_edit_id";

alter table "public"."FormDefinition" drop column "view_id";

alter table "public"."FormDefinition" add column "id_for_edit" text not null default gen_random_uuid();

alter table "public"."FormDefinition" add column "id_for_extention" text not null default gen_random_uuid();

alter table "public"."FormDefinition" add column "id_for_view" text not null default gen_random_uuid();


