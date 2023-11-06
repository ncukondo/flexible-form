import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { FormDefinition, safeParseFormDefinition as safeParseFormDefinition } from "./schema";
import { FormDefinitionForEdit } from "./server/types";

interface FormDefinitionStore {
  source: object | null;
  error: string;
  setSource: (source: object | null) => void;
  formDefinition: FormDefinition | null;
}

const useFormDefinition = create<FormDefinitionStore>()(
  devtools(set => {
    const setSource = (source: object | null) => {
      const res = safeParseFormDefinition(source);
      if (res.success) {
        set({ formDefinition: res.data, error: "" });
      } else {
        set({ error: res.error.message });
      }
    };
    return { source: null, setSource, formDefinition: null, error: "" };
  }),
);

interface FormDefinitionForEditStore {
  formDefinitionForEdit: FormDefinitionForEdit | null;
  setFormDefinitionForEdit: (formDefinition: FormDefinitionForEdit | null) => void;
}
const useFormDefinitionForEdit = create<FormDefinitionForEditStore>()(
  devtools(set => {
    const setFormDefinitionForEdit = (formDefinitionForEdit: FormDefinitionForEdit | null) => {
      set({ formDefinitionForEdit });
    };
    return { formDefinitionForEdit: null, setFormDefinitionForEdit };
  }),
);

export { useFormDefinition, useFormDefinitionForEdit };
