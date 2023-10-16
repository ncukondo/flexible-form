import { db } from "@service/db";

const getFormDefinitionForEdit = async (id_for_edit: string) => {
  const formDefinition = await db.formDefinition.findFirst({
    where: {
      id_for_edit,
    },
  });
  return formDefinition;
};

const getFormDefinitionForView = async (id_for_view: string) => {
  const formDefinition = await db.formDefinition.findFirst({
    where: {
      id_for_view,
    },
  });
  return formDefinition;
};

export { getFormDefinitionForEdit, getFormDefinitionForView };
