create type "public"."FormAccessRole" as enum ('ADMIN', 'EDITOR', 'VIEWER');

create table "public"."FormPermission" (
    "id" uuid not null default gen_random_uuid(),
    "form_id" uuid not null,
    "email" text not null,
    "role" "FormAccessRole" not null
);


CREATE UNIQUE INDEX "FormPermission_pkey" ON public."FormPermission" USING btree (id);

alter table "public"."FormPermission" add constraint "FormPermission_pkey" PRIMARY KEY using index "FormPermission_pkey";

alter table "public"."FormPermission" add constraint "FormPermission_form_id_fkey" FOREIGN KEY (form_id) REFERENCES "FormDefinition"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."FormPermission" validate constraint "FormPermission_form_id_fkey";


