import { z } from "zod";
import { makeDefaultValues, SearchParams } from "@/common/url";
import { getFormDefinitionForEdit } from "@/features/form-definition/server";
import EditByTomlForm from "../../features/form-definition/toml/edit-by-toml";
import { LogInPage } from "../../features/user/login-forms";
import { getUser, isUserInWhileListForEdit } from "../../features/user/user";

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
