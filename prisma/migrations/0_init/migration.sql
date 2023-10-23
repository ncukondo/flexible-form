-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateSchema


CREATE SCHEMA IF NOT EXISTS "extensions";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS moddatetime WITH SCHEMA extensions;

CREATE SCHEMA IF NOT EXISTS "graphql";

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA extensions;

CREATE SCHEMA IF NOT EXISTS "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA pgsodium;


CREATE SCHEMA IF NOT EXISTS "vault";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA vault;

---------------------------- START OF MADE ADJUSTMENTS TO MAKE PRISMA WORK WITH SUPABASE ---------------------------
-- see https://medium.com/@ngoctranfire/using-prisma-with-supabase-row-level-security-and-multi-schema-7c53418adba3
--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select nullif(current_setting('request.jwt.claim.email', true), '')::text;
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select nullif(current_setting('request.jwt.claim.role', true), '')::text;
$$;


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

---------------------------- END OF MADE ADJUSTMENTS TO MAKE PRISMA WORK WITH SUPABASE ---------------------------

