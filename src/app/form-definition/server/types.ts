import { Prisma } from "@prisma/client";

type RegisteredFormDefinition = {
  id: string;
  created_at: Date;
  updated_at: Date;
  title: string;
  source: string;
  actions: string[];
  form_definition: Prisma.JsonValue;
  author_uid: string | null;
  id_for_edit: string;
  id_for_view: string;
  id_for_extend: string;
};
type FormDefinitionForEdit = {
  created_at: Date;
  updated_at: Date;
  title: string;
  source: string;
  form_definition: Prisma.JsonValue;
  id_for_edit: string;
  id_for_extend: string;
  id_for_view: string;
};
type FormDefinitionForView = {
  created_at: Date;
  updated_at: Date;
  title: string;
  form_definition: Prisma.JsonValue;
  id_for_view: string;
};

export { type RegisteredFormDefinition, type FormDefinitionForEdit, type FormDefinitionForView };
