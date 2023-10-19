drop index if exists "public"."FormDefinition_id_for_extention_key";

alter table "public"."FormDefinition" drop column "id_for_extention";

alter table "public"."FormDefinition" add column "id_for_extend" text not null default gen_random_uuid();

CREATE UNIQUE INDEX "FormDefinition_id_for_extend_key" ON public."FormDefinition" USING btree (id_for_extend);


