import { z } from "zod";
import { getFormDefinitionForView } from "@service/registered-form-definition";
import DefinedFormViewer from "./DefinedFormViewer";
import { safeParse } from "../edit/form-definition-schema";
import { toUUID } from "@lib/uuid";

const extractIdForView = (urlParams: unknown) => {
  const res = z.object({ id_for_view: z.string() }).safeParse(urlParams);
  if (!res.success) return null;
  return toUUID(res.data.id_for_view);
};

const extractDefaultValues = (urlParams: unknown) => {
  const res = z.object({ data: z.any() }).safeParse(urlParams);
  if (!res.success) return {};
  return res.data.data ?? {};
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
  const formDefinitionRes = safeParse(registeredFormDefinitionForEdit.content);
  if (!formDefinitionRes.success) return <FormNotFound />;
  const formDefinition = formDefinitionRes.data;
  return (
    <DefinedFormViewer
      defaultValues={
        extractDefaultValues(searchParams) as { [key: string]: string | string[] | undefined }
      }
      {...{ formDefinition }}
    />
  );
}
