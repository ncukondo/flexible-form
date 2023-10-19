import EditByTomlForm from "./edit-by-toml";
import { z } from "zod";
import { getFormDefinitionForEdit } from "@service/registered-form-definition";
import { toUUID } from "@lib/uuid";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { supabaseInfo } from "../auth/supabase_info";

const extractIdForEdit = (urlParams: unknown) => {
  const res = z.object({ id_for_edit: z.string() }).safeParse(urlParams);
  if (!res.success) return null;
  return toUUID(res.data.id_for_edit);
};

const extractRegisteredFormDefinitionForEdit = async (urlParams: unknown) => {
  const id_for_edit = extractIdForEdit(urlParams);
  if (!id_for_edit) return null;
  return await getFormDefinitionForEdit(id_for_edit);
};

const getUser = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore }, supabaseInfo);
  const { data, error } = await supabase.auth.getUser();
  console.log(data);
  if (error) console.error(error);
  return data.user;
};

type SearchParams = { [key: string]: string | string[] | undefined };
export default async function EditForm({ searchParams }: { searchParams: SearchParams }) {
  const formDefinitionForEdit = await extractRegisteredFormDefinitionForEdit(searchParams);
  const user = await getUser();
  return (
    <EditByTomlForm defaultValues={searchParams} formDefinitionForEdit={formDefinitionForEdit} />
  );
}
