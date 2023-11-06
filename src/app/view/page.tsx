import { z } from "zod";
import { getFormDefinitionForView } from "@/app/_form-definition/server";
import DefinedFormViewer from "../_defined-form/DefinedFormViewer";
import { safeParseFormDefinitionForView } from "../_form-definition/schema";
import { makeDefaultValues, SearchParams } from "../_url";

const extractIdForView = (urlParams: unknown) => {
  const res = z.object({ id_for_view: z.string() }).safeParse(urlParams);
  if (!res.success) return null;
  return res.data.id_for_view;
};

const extractRegisteredFormDefinitionForView = async (urlParams: unknown) => {
  const id_for_view = extractIdForView(urlParams);
  if (!id_for_view) return null;
  return await getFormDefinitionForView(id_for_view);
};

function FormNotFound() {
  return <div>not found</div>;
}

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
