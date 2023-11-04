"use client";
import "@service/url/init-client-url";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { initTomlText, useTomlText, resetTomlText } from "./store";
import { useFormDefinition, useFormDefinitionForEdit } from "../store";
import { DefinedForm } from "../../_components/features/defined-form";
import { FormDefinition } from "../schema";
import { registerFormDefinition, updateFormDefinition } from "../server";
import { FormDefinitionForEdit } from "../server";
import { toast } from "../../_components/toast";
import { showConfirmDialog } from "../../_components/confirm-dialog";
import Link from "next/link";
import { CopyButton } from "../../_components/copy-button";
import { useRouter } from "next/navigation";
import { ParamObject } from "../../_lib/flatten-object";
import { sampleTomlDefinition } from "./sample-toml";
import { ErrorDisplay, useErrorMessage } from "./error-display";
import { getEditUrl, getViewUrl } from "@/app/_service/url";
import { EditPermissionButton } from "../share-config";

const registeredDefinitionToUrls = (value: FormDefinitionForEdit) => {
  return {
    edit: getEditUrl(value.id_for_edit),
    view: getViewUrl(value.id_for_view),
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
        if (!formDefinitionForEdit) router.replace(`/e/${value.id_for_edit}`);
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

type EditConfigProps = Omit<JSX.IntrinsicElements["textarea"], "value" | "onChange" | "onSubmit">;
function EditConfig(props: EditConfigProps) {
  const { getToml, setToml } = useTomlText();
  const { isPending, registerFormDefinicion } = useRegisterFormDefinition();
  const { formDefinitionForEdit } = useFormDefinitionForEdit();
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
          {...props}
          value={getToml()}
          onChange={e => setToml?.(e.target.value)}
        />
        <ErrorDisplay />
      </div>
      <div className="p-2 grid justify-items-end grid-flow-col grid-cols-1 gap-4">
        {formDefinitionForEdit && (
          <>
            <EditPermissionButton id_for_edit={formDefinitionForEdit.id_for_edit} />
            <button
              onClick={e => {
                e.preventDefault();
                showUrl(formDefinitionForEdit);
              }}
              className="btn"
            >
              show URLs
            </button>
          </>
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

function handleSubmitDefinedForm(data: { [key: string]: any }) {
  alert(JSON.stringify(data, null, 2));
}

function initTomlStore(formDefinitionForEdit: FormDefinitionForEdit | null | undefined) {
  useEffect(() => {
    const id = formDefinitionForEdit?.id_for_edit || "";
    const toml = formDefinitionForEdit ? formDefinitionForEdit.source || "" : sampleTomlDefinition;
    const tomlAsObject = (formDefinitionForEdit?.form_definition as { [key: string]: any }) ?? "";
    initTomlText(id, toml || tomlAsObject);
  }, [formDefinitionForEdit]);
}

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
  initTomlStore(formDefinitionForEdit);
  return (
    <main className="min-h-[100dvh] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid">
      <div className="bg-yellow-100 w-full h-full relative p-2 min-h-[50dvh]">
        <EditConfig />
      </div>
      <div className="w-full h-full p-2  max-h-[100dvh]">
        <div className="p-2  h-full">
          {formDefinition && (
            <DefinedForm
              {...{
                onSubmit: handleSubmitDefinedForm,
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
