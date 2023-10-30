import { db } from "./db";
import { FormDefinitionForEdit, FormDefinitionForView } from "./types";
import { safeParseFormDefinitionForView } from "../schema";
import { getUser } from "@/app/_service/user";
import { convertToClient, convertToServerId, excludeFields, getFormEditorCondition } from "./utils";

const getFormDefinitionForEdit = async (idForEdit: string) => {
  const id_for_edit = convertToServerId(idForEdit);
  const user = await getUser();
  if (!user) throw new Error("User not found");
  const formDefinition = await db.formDefinition.findUnique({
    ...getFormEditorCondition(id_for_edit, user.email),
  });
  if (!formDefinition) throw new Error("Form definition not found");
  formDefinition.form_definition = {
    ...(formDefinition.form_definition as object),
    actions: formDefinition.actions,
  };
  return convertToClient(formDefinition, ["id_for_edit", "id_for_extend", "id_for_view"] as const);
};

const getFormAction = async (idForView: string) => {
  const id_for_view = convertToServerId(idForView);
  const { actions } = await db.formDefinition.findUniqueOrThrow({
    where: {
      id_for_view,
    },
    select: {
      actions: true,
    },
  });
  return actions;
};

const getFormDefinitionForView = async (idForView: string) => {
  const id_for_view = convertToServerId(idForView);
  const formDefinition = await db.formDefinition.findUniqueOrThrow({
    where: {
      id_for_view,
    },
    select: excludeFields(db.formDefinition, ["actions", "id", "id_for_edit", "id_for_extend"]),
  });
  const res = safeParseFormDefinitionForView(formDefinition.form_definition);
  if (!res || !res.success) throw new Error("Form definition not found");
  return convertToClient(formDefinition, ["id_for_view"] as const);
};

export { getFormDefinitionForEdit, getFormDefinitionForView, getFormAction };
