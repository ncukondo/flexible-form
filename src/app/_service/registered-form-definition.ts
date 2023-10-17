import { FormDefinitionForEdit, FormDefinitionForView, db } from "@service/db";

const getFormDefinitionForEdit = async (id_for_edit: string) => {
  const formDefinition = await db.formDefinition.findUnique({
    where: {
      id_for_edit,
    },
  });
  if (!formDefinition) throw new Error("Form definition not found");
  const formDefinitionForEdit: FormDefinitionForEdit = {
    content: formDefinition.content,
    createdAt: formDefinition.createdAt,
    id_for_edit: formDefinition.id_for_edit,
    id_for_extend: formDefinition.id_for_extend,
    id_for_view: formDefinition.id_for_view,
    title: formDefinition.title,
    updatedAt: formDefinition.updatedAt,
  };
  return formDefinitionForEdit;
};

const getFormDefinitionForView = async (id_for_view: string) => {
  const formDefinition = await db.formDefinition.findUniqueOrThrow({
    where: {
      id_for_view,
    },
  });
  const formDefinitionForView: FormDefinitionForView = {
    content: formDefinition.content,
    createdAt: formDefinition.createdAt,
    id_for_view: formDefinition.id_for_view,
    title: formDefinition.title,
    updatedAt: formDefinition.updatedAt,
  };
  return formDefinitionForView;
};

export { getFormDefinitionForEdit, getFormDefinitionForView };
