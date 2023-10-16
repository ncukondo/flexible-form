"use client";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { initUseTomlText, useTomlDerivedJson, useTomlText } from "./toml-based-definition-store";
import { useFormDefinition, useRegisteredFormDefinition } from "./form-definiton-store";
import { DefinedForm } from "../_components/defined-form";
import { FormDefinition } from "./form-definition-schema";
import { registerFormDefinition, updateFormDefinition } from "./actions";
import { RegisteredFormDefinition } from "../_service/db";
import { z } from "zod";

function useErrorMessage() {
  const { error: syntaxError } = useTomlDerivedJson(s => ({ error: s.error }));
  const schemaError = useFormDefinition(s => s.error);
  return (
    (syntaxError ? "SyntaxError: " + syntaxError : "") ||
    (schemaError ? "SchemaError: " + schemaError : "")
  );
}

function ErrorDisplay() {
  const error = useErrorMessage();
  return (
    <>
      {error && (
        <div className="alert alert-error shadow-lg m-2 w-[calc(100%-0.5rem)] max-h-32 overflow-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}
    </>
  );
}

const registeredDefinitionToUrls = (value: RegisteredFormDefinition) => {
  const urlBase = document.location.origin;
  return {
    edit: `${urlBase}/e/${value.id_for_edit}`,
    extend: `${urlBase}/l/${value.id_for_extention}`,
    view: `${urlBase}/v/${value.id_for_view}`,
  };
};

type OnSubmit = (data: FormDefinition) => void;
type EditConfigProps = Omit<
  JSX.IntrinsicElements["textarea"],
  "value" | "onChange" | "onSubmit"
> & { onSubmit?: OnSubmit };
function EditConfig(props: EditConfigProps) {
  const { toml, setToml } = useTomlText(s => ({ toml: s.toml, setToml: s.setToml }));
  const [isPending, startTransition] = useTransition();
  const { registeredFormDefinition, setRegisteredFormDefinition } = useRegisteredFormDefinition();
  const { onSubmit, ...restProps } = props;
  const formDefinition = useFormDefinition(s => s.formDefinition);
  const error = useErrorMessage();
  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formDefinition) {
      startTransition(() => {
        (async () => {
          const value = registeredFormDefinition
            ? await updateFormDefinition(registeredFormDefinition.id, formDefinition)
            : await registerFormDefinition(formDefinition);
          setRegisteredFormDefinition(value);
          const urls = registeredDefinitionToUrls(value);
          alert(JSON.stringify(urls));
        })();
      });
    }
  };
  const showUrl = (value: RegisteredFormDefinition) => {
    const urls = registeredDefinitionToUrls(value);
    alert(JSON.stringify(urls));
  };
  return (
    <form className="h-full w-full grid grid-rows-[1fr,auto]" onSubmit={handleOnSubmit}>
      <div className="h-full w-full grid grid-rows-[1fr,auto]">
        <textarea
          className="w-full h-full textarea font-mono"
          {...restProps}
          value={toml}
          onChange={e => setToml?.(e.target.value)}
        />
        <ErrorDisplay />
      </div>
      <div className="p-2 grid justify-items-end grid-flow-col grid-cols-1 gap-4">
        {registeredFormDefinition && (
          <button
            onClick={e => {
              e.preventDefault();
              showUrl(registeredFormDefinition);
            }}
            className="btn"
          >
            show URLs
          </button>
        )}
        <button className="btn" disabled={!!error && formDefinition !== null && !isPending}>
          {registeredFormDefinition ? "update" : "register"}
        </button>
      </div>
    </form>
  );
}

type EditByTomlFormProps = {
  defaultValues?: { [key: string]: string | string[] | undefined };
  formDefinitionForEdit?: RegisteredFormDefinition | null;
};
export default function EditByTomlForm({
  defaultValues,
  formDefinitionForEdit,
}: EditByTomlFormProps) {
  const formDefinition = useFormDefinition(s => s.formDefinition);
  const setRegisteredFormDefinition = useRegisteredFormDefinition(
    s => s.setRegisteredFormDefinition,
  );
  if (formDefinitionForEdit) setRegisteredFormDefinition(formDefinitionForEdit);
  useEffect(() => {
    initUseTomlText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useTomlText]);
  const onSubmitDefinedForm = (data: { [key: string]: any }) =>
    alert(JSON.stringify(data, null, 2));
  const onSubmitSchemeForm = async (data: FormDefinition) => {
    alert(JSON.stringify(data, null, 2));
  };
  return (
    <main className="min-h-[100dvh] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid">
      <div className="bg-yellow-100 w-full h-full relative p-2 min-h-[50dvh]">
        <EditConfig {...{ onSubmit: onSubmitSchemeForm }} />
      </div>
      <div className="w-full h-full p-2  max-h-[100dvh]">
        <div className="p-2  h-full">
          {formDefinition && (
            <DefinedForm {...{ onSubmit: onSubmitDefinedForm, formDefinition, defaultValues }} />
          )}
        </div>
      </div>
    </main>
  );
}
