"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { submitFormAction } from "./actions";
import type { ActionError } from "./actions";
import { DefinedForm } from "./defined-form";
import { ParamObject } from "../../common/flatten-object";
import { FormDefinitionForView } from "../form-definition/schema";

const useFormSubmission = (id_for_view: string, formDefinition: FormDefinitionForView) => {
  const [isPending, setIsPending] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<ActionError[] | null>(null);
  const submitForm = (formValue: unknown) => {
    setIsPending(true);
    setSubmitErrors(null);
    (async () => {
      try {
        const result = await submitFormAction(id_for_view, formValue, formDefinition);
        if (result && !result.success) {
          setSubmitErrors(result.errors);
        }
      } catch (e) {
        toast.error("Error submitting form");
        console.error(e);
      } finally {
        setIsPending(false);
      }
    })();
  };
  return { isPending, submitForm, submitErrors };
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
  const { isPending, submitForm, submitErrors } = useFormSubmission(id_for_view, formDefinition);
  const onSubmit = (data: { [key: string]: any }) => submitForm(data);
  return (
    <div className="mx-auto max-w-3xl py-12 my-0 px-4">
      <DefinedForm {...{ formDefinition, onSubmit, defaultValues, isPending, submitErrors }} />
    </div>
  );
}