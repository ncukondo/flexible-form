import { z } from "zod";
import { getFormDefinitionForView } from "@service/registered-form-definition";
import DefinedFormViewer from "./DefinedFormViewer";
import { safeParseFormDefinitionForView } from "../edit/form-definition-schema";
import { toUUID } from "@lib/uuid";
import { makeDefaultValues } from "../_service/utils";

const extractIdForView = (urlParams: unknown) => {
  const res = z.object({ id_for_view: z.string() }).safeParse(urlParams);
  if (!res.success) return null;
  return toUUID(res.data.id_for_view);
};

const extractRegisteredFormDefinitionForView = async (urlParams: unknown) => {
  const id_for_view = extractIdForView(urlParams);
  if (!id_for_view) return null;
  return await getFormDefinitionForView(id_for_view);
};

function FormNotFound() {
  return <div>not found</div>;
}

type SearchParams = { [key: string]: string | string[] | undefined };
export default async function ViewForm({ searchParams }: { searchParams: SearchParams }) {
  const registeredFormDefinitionForEdit =
    await extractRegisteredFormDefinitionForView(searchParams);
  if (!registeredFormDefinitionForEdit) return <FormNotFound />;
  const formDefinitionRes = safeParseFormDefinitionForView(
    registeredFormDefinitionForEdit.form_definition,
  );
  if (!formDefinitionRes.success) return <FormNotFound />;
  const formDefinition = formDefinitionRes.data;
  const defaultValues = makeDefaultValues(searchParams);
  return (
    <DefinedFormViewer
      {...{
        formDefinition,
        id_for_view: registeredFormDefinitionForEdit.id_for_view,
        defaultValues,
      }}
    />
  );
}
