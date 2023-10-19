create extension if not exists "moddatetime" with schema "extensions";


alter table "public"."FormDefinition" add column "user_id" uuid default auth.uid();

alter table "public"."FormDefinition" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."FormDefinition" alter column "id_for_edit" set data type uuid using "id_for_edit"::uuid;

alter table "public"."FormDefinition" alter column "id_for_extend" set data type uuid using "id_for_extend"::uuid;

alter table "public"."FormDefinition" alter column "id_for_view" set data type uuid using "id_for_view"::uuid;

CREATE TRIGGER handle_update_at BEFORE UPDATE ON public."FormDefinition" FOR EACH ROW EXECUTE FUNCTION moddatetime();


