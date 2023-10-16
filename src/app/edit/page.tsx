import EditByTomlForm from "./edit-by-toml";
import { z } from "zod";
import { getFormDefinitionForEdit } from "@service/registered-form-definition";

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

type SearchParams = { [key: string]: string | string[] | undefined };
export default async function EditForm({ searchParams }: { searchParams: SearchParams }) {
  const registeredFormDefinitionForEdit =
    await extractRegisteredFormDefinitionForEdit(searchParams);
  return (
    <EditByTomlForm
      defaultValues={searchParams}
      formDefinitionForEdit={registeredFormDefinitionForEdit}
    />
  );
}
