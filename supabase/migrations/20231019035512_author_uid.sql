alter table "public"."FormDefinition" drop column "author_id";

alter table "public"."FormDefinition" add column "author_uid" uuid default auth.uid();


