import EditByTomlForm from "../_form-definition/toml/edit-by-toml";
import { z } from "zod";
import { getFormDefinitionForEdit } from "@/app/_form-definition/server";
import { getUser, isUserInWhileListForEdit } from "../_user/user";
import { LogInPage } from "../_user/login-forms";
import { makeDefaultValues, SearchParams } from "../_url";

const extractIdForEdit = (urlParams: unknown) => {
  const res = z.object({ id_for_edit: z.string() }).safeParse(urlParams);
  if (!res.success) return null;
  return res.data.id_for_edit;
};

const extractRegisteredFormDefinitionForEdit = async (urlParams: unknown) => {
  const id_for_edit = extractIdForEdit(urlParams);
  if (!id_for_edit) return null;
  return await getFormDefinitionForEdit(id_for_edit);
};

export default async function EditForm({ searchParams }: { searchParams: SearchParams }) {
  const formDefinitionForEdit = await extractRegisteredFormDefinitionForEdit(searchParams);
  const defaultValues = makeDefaultValues(searchParams);
  const user = await getUser();
  if (!user || !isUserInWhileListForEdit(user))
    return <LogInPage {...{ user, buttonToEditForm: false }} />;

  return <EditByTomlForm {...{ defaultValues, formDefinitionForEdit }} />;
}
