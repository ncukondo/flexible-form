"use client";

import { useTransition } from "react";
import { DefinedForm } from "../_components/defined-form";
import { FormDefinitionForView } from "../edit/form-definition-schema";
import { submitFormAction } from "./actions";

const useFormSubmission = (id_for_view: string, formDefinition: FormDefinitionForView) => {
  const [isPending, startTransition] = useTransition();
  const registerFormDefinicion = (formValue: unknown) => {
    startTransition(() => {
      (async () => {
        await submitFormAction(id_for_view, formValue, formDefinition);
      })();
    });
  };
  return { isPending, registerFormDefinicion };
};

interface ViewFormProps {
  id_for_view: string;
  formDefinition: FormDefinitionForView;
  defaultValues?: { [key: string]: string | string[] | undefined };
}
export default function DefinedFormViewer({
  id_for_view,
  formDefinition,
  defaultValues,
}: ViewFormProps) {
  const { isPending, registerFormDefinicion } = useFormSubmission(id_for_view, formDefinition);
  const onSubmit = (data: { [key: string]: any }) => registerFormDefinicion(data);
  return (
    <div className="mx-auto max-w-3xl py-12 my-0">
      <DefinedForm {...{ formDefinition, onSubmit, defaultValues }} />
    </div>
  );
}
