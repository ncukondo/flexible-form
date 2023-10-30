"use client";
import { FormEvent, useEffect, useState, useTransition } from "react";
import {
  initTomlText,
  useTomlDerivedJson,
  useTomlText,
  resetTomlText,
} from "./toml-based-definition-store";
import { useFormDefinition, useFormDefinitionForEdit } from "./form-definiton-store";
import { DefinedForm } from "../_components/features/defined-form";
import { FormDefinition } from "./form-definition-schema";
import { registerFormDefinition, updateFormDefinition } from "./actions";
import { FormDefinitionForEdit, RegisteredFormDefinition } from "../_service/db";
import { toShortUUID } from "../_lib/uuid";
import { toast } from "../_components/toast";
import { showConfirmDialog } from "../_components/confirm-dialog";
import Link from "next/link";
import { CopyButton } from "../_components/copy-button";
import { useRouter } from "next/navigation";
import { ParamObject } from "../_lib/flatten-object";
import { sampleTomlDefinition } from "./sample-toml-definition";

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

const registeredDefinitionToUrls = (value: FormDefinitionForEdit) => {
  const urlBase = document.location.origin;
  return {
    edit: `${urlBase}/e/${toShortUUID(value.id_for_edit)}`,
    view: `${urlBase}/v/${toShortUUID(value.id_for_view)}`,
  };
};

const useRegisterFormDefinition = () => {
  const [, startTransition] = useTransition();
  const [isPending, setIsPending] = useState(false);
  const { formDefinitionForEdit, setFormDefinitionForEdit } = useFormDefinitionForEdit();
  const router = useRouter();
  const registerFormDefinicion = (formDefinition: FormDefinition, source = "") => {
    setIsPending(true);
    startTransition(() => {
      (async () => {
        const value = formDefinitionForEdit
          ? await updateFormDefinition(formDefinitionForEdit.id_for_edit, formDefinition, source)
          : await registerFormDefinition(formDefinition, source);
        setFormDefinitionForEdit(value);
        resetTomlText(value.id_for_edit, source);
        setIsPending(false);
        const message = formDefinitionForEdit ? "Form was updated." : "Form was registered.";
        if (!formDefinitionForEdit) router.replace(`/e/${toShortUUID(value.id_for_edit)}`);
        toast(message);
      })();
    });
  };
  return { isPending, registerFormDefinicion };
};

const showUrl = async (value: FormDefinitionForEdit) => {
  const urls = registeredDefinitionToUrls(value);
  const content = (
    <div className="grid grid-cols-1 gap-8">
      {Object.entries(urls).map(([key, url]) => (
        <div key={key} className="flex flex-col gap-2">
          <div>Url for {key}: </div>
          <div className="flex flex-row items-center gap-1">
            <CopyButton content={url} />
            <Link href={url} target="_blank" className="link">
              {url}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
  await showConfirmDialog({ content });
};

type OnSubmit = (data: FormDefinition) => void;
type EditConfigProps = Omit<
  JSX.IntrinsicElements["textarea"],
  "value" | "onChange" | "onSubmit"
> & { onSubmit?: OnSubmit };
function EditConfig(props: EditConfigProps) {
  const { getToml, setToml } = useTomlText();
  const { isPending, registerFormDefinicion } = useRegisterFormDefinition();
  const { formDefinitionForEdit } = useFormDefinitionForEdit();
  const { onSubmit, ...restProps } = props;
  const formDefinition = useFormDefinition(s => s.formDefinition);
  const error = useErrorMessage();
  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formDefinition) {
      registerFormDefinicion(formDefinition, getToml());
    }
  };
  return (
    <form className="h-full w-full grid grid-rows-[1fr,auto]" onSubmit={handleOnSubmit}>
      <div className="h-full w-full grid grid-rows-[1fr,auto]">
        <textarea
          className="w-full h-full textarea font-mono"
          {...restProps}
          value={getToml()}
          onChange={e => setToml?.(e.target.value)}
        />
        <ErrorDisplay />
      </div>
      <div className="p-2 grid justify-items-end grid-flow-col grid-cols-1 gap-4">
        {formDefinitionForEdit && (
          <button
            onClick={e => {
              e.preventDefault();
              showUrl(formDefinitionForEdit);
            }}
            className="btn"
          >
            show URLs
          </button>
        )}
        <button className="btn" disabled={!!error && formDefinition !== null && !isPending}>
          {isPending ? (
            <span className="flex flex-row items-center gap-4">
              <span className="loading loading-spinner loading-xs"></span>
              Saving...
            </span>
          ) : (
            <span>{formDefinitionForEdit ? "update" : "register"}</span>
          )}
        </button>
      </div>
    </form>
  );
}

const useIdForView = () => {
  const formDefinitionForEdit = useFormDefinitionForEdit(s => s.formDefinitionForEdit);
  return formDefinitionForEdit?.id_for_view ?? "";
};

type EditByTomlFormProps = {
  defaultValues?: ParamObject;
  formDefinitionForEdit?: FormDefinitionForEdit | null;
};
export default function EditByTomlForm({
  defaultValues,
  formDefinitionForEdit,
}: EditByTomlFormProps) {
  const formDefinition = useFormDefinition(s => s.formDefinition);
  const setFormDefinitionForEdit = useFormDefinitionForEdit(s => s.setFormDefinitionForEdit);
  const id_for_view = useIdForView();
  if (formDefinitionForEdit) setFormDefinitionForEdit(formDefinitionForEdit);
  useEffect(() => {
    const id = formDefinitionForEdit?.id_for_edit || "";
    const toml = formDefinitionForEdit ? formDefinitionForEdit.source || "" : sampleTomlDefinition;
    const tomlAsObject = (formDefinitionForEdit?.form_definition as { [key: string]: any }) ?? "";
    initTomlText(id, toml || tomlAsObject);
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
            <DefinedForm
              {...{
                onSubmit: onSubmitDefinedForm,
                formDefinition,
                defaultValues,
                showPrefilledUrlButton: true,
                id_for_view,
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
