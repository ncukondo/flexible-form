"use client";

import { useState, useTransition } from "react";
import { DefinedForm } from "../_components/features/defined-form";
import { FormDefinitionForView } from "../edit/form-definition-schema";
import { submitFormAction } from "./actions";
import { ParamObject } from "../_lib/flatten-object";

const useFormSubmission = (id_for_view: string, formDefinition: FormDefinitionForView) => {
  const [, startTransition] = useTransition();
  const [isPending, setIsPending] = useState(false);
  const submitForm = (formValue: unknown) => {
    setIsPending(true);
    startTransition(() => {
      (async () => {
        await submitFormAction(id_for_view, formValue, formDefinition);
        setIsPending(false);
      })();
    });
  };
  return { isPending, submitForm };
};

interface ViewFormProps {
  id_for_view: string;
  formDefinition: FormDefinitionForView;
  defaultValues?: ParamObject;
}
export default function DefinedFormViewer({
  id_for_view,
  formDefinition,
  defaultValues,
}: ViewFormProps) {
  const { isPending, submitForm } = useFormSubmission(id_for_view, formDefinition);
  const onSubmit = (data: { [key: string]: any }) => submitForm(data);
  return (
    <div className="mx-auto max-w-3xl py-12 my-0">
      <DefinedForm {...{ formDefinition, onSubmit, defaultValues, isPending }} />
    </div>
  );
}
