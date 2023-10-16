"use client";

import { DefinedForm } from "../_components/defined-form";
import { FormDefinition } from "../edit/form-definition-schema";

interface ViewFormProps {
  formDefinition: FormDefinition;
  defaultValues?: { [key: string]: string | string[] | undefined };
}
export default function DefinedFormViewer({ formDefinition, defaultValues }: ViewFormProps) {
  const onSubmit = (data: { [key: string]: any }) => alert(JSON.stringify(data, null, 2));
  return (
    <div className="mx-auto max-w-3xl py-12 my-0">
      <DefinedForm {...{ formDefinition, onSubmit, defaultValues }} />
    </div>
  );
}
