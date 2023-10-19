import { FormDefinitionForEdit, FormDefinitionForView, db } from "@service/db";
import { safeParseFormDefinitionForView } from "../edit/form-definition-schema";

const getFormDefinitionForEdit = async (id_for_edit: string) => {
  const formDefinition = await db.formDefinition.findUnique({
    where: {
      id_for_edit,
    },
  });
  if (!formDefinition) throw new Error("Form definition not found");
  const formDefinitionForEdit: FormDefinitionForEdit = {
    form_definition: formDefinition.form_definition,
    created_at: formDefinition.created_at,
    id_for_edit: formDefinition.id_for_edit,
    id_for_extend: formDefinition.id_for_extend,
    id_for_view: formDefinition.id_for_view,
    title: formDefinition.title,
    updated_at: formDefinition.updated_at,
  };
  return formDefinitionForEdit;
};

const getFormDefinitionForView = async (id_for_view: string) => {
  const formDefinition = await db.formDefinition.findUniqueOrThrow({
    where: {
      id_for_view,
    },
  });
  const res = safeParseFormDefinitionForView(formDefinition.form_definition);
  if (!res || !res.success) throw new Error("Form definition not found");
  const formDefinitionForView: FormDefinitionForView = {
    form_definition: res.data,
    created_at: formDefinition.created_at,
    id_for_view: formDefinition.id_for_view,
    title: formDefinition.title,
    updated_at: formDefinition.updated_at,
  };
  return formDefinitionForView;
};

export { getFormDefinitionForEdit, getFormDefinitionForView };
