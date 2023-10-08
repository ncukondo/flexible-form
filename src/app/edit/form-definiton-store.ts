import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { FormDefinition, safeParse as safeParseFormDefinition } from './form-definition-schema'
import { makeDerivedConnection } from './store-utils';
import { useTomlDerivedJson } from './store';

interface FormDefinitionStore {
  source: object | null;
  error: string;
  setSource: (source: object | null) => void;
  formDefinition: FormDefinition | null;
}

const useFormDefinition = create<FormDefinitionStore>()(
  devtools(
    set => {
      const setSource = (source: object | null) => {
        const res = safeParseFormDefinition(source);
        if (res.success) {
          set({ formDefinition: res.data, error: "" })
        } else {
          set({ error: res.error.message })
        }
      }
      return { source: null, setSource, formDefinition: null, error: "" };
    }
  )
)

makeDerivedConnection(useTomlDerivedJson, useFormDefinition, (source, listner) => listner.setSource(source.jsonObject))

export { useFormDefinition };