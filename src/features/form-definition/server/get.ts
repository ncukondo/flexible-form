"use server";
import { db } from "./db";
import { convertToClient, convertToServerId, excludeFields, getFormEditorCondition } from "./utils";
import { User, getUser } from "../../user/user";
import { safeParseFormDefinitionForView } from "../schema";

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

const getPostSubmit = async (idForView: string) => {
  const id_for_view = convertToServerId(idForView);
  const { form_definition } = await db.formDefinition.findUniqueOrThrow({
    where: {
      id_for_view,
    },
    select: {
      form_definition: true,
    },
  });
  return ((form_definition as any).post_submit as { message?: string }) ?? null;
};

const getFormUsers = async (idForEdit: string) => {
  const id_for_edit = convertToServerId(idForEdit);
  const user = await getUser();
  if (!user) throw new Error("User not found");
  const formDefinition = await db.formDefinition.findUnique({
    ...getFormEditorCondition(id_for_edit, user.email),
    select: {
      permisions: {
        select: {
          email: true,
          role: true,
        },
      },
    },
  });
  if (!formDefinition) throw new Error("Form definition not found");
  return formDefinition.permisions;
};

const getUserForms = async (user: User) => {
  const formDefinitions = await db.formDefinition.findMany({
    where: {
      permisions: {
        some: {
          email: user.email,
        },
      },
    },
    orderBy: {
      updated_at: "desc",
    },
    select: {
      id_for_view: true,
      id_for_edit: true,
      title: true,
      created_at: true,
      updated_at: true,
      form_definition: true,
    },
  });
  return formDefinitions
    .map(formDefinitions => {
      const { form_definition, ...rest } = formDefinitions;
      const description =
        ((form_definition &&
          typeof form_definition === "object" &&
          "description" in form_definition &&
          form_definition.description) as string) ?? "";
      return {
        ...rest,
        description,
      };
    })
    .map(formDefinition =>
      convertToClient(formDefinition, ["id_for_view", "id_for_edit"] as const),
    );
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

export {
  getFormDefinitionForEdit,
  getFormDefinitionForView,
  getFormAction,
  getFormUsers,
  getUserForms,
  getPostSubmit,
};
