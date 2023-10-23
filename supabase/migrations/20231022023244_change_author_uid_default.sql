alter table "public"."FormDefinition" alter column "author_uid" set default (auth.jwt() ->> 'sub'::text);


