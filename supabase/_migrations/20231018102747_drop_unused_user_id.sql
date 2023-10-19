drop trigger if exists "handle_update_at" on "public"."FormDefinition";


alter table "public"."FormDefinition" drop column "user_id";

