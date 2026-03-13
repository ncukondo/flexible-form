"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ParamObject } from "@/common/flatten-object";
import { makePrefilledUrl } from "@/common/url";
import type { ActionError } from "./actions";
import { FormItem } from "./form-item";
import { styledText } from "./styled-text";
import { SubmitErrorAlert } from "./submit-error-alert";
import { getVisibilityDependentKeys, getVisibleIds, getVisibleItems } from "./visibility";
import { makeVisibilityAwareResolver } from "./visibility-resolver";
import { FormDefinitionForView } from "../../features/form-definition/schema";
import "@/common/url/init-client-url";
import { showConfirmDialog } from "../../ui/confirm-dialog";
import { CopyButton } from "../../ui/copy-button";

const showUrl = async (url: string) => {
  const content = (
    <div className="grid grid-cols-1 gap-8">
      <div className="flex flex-col gap-2">
        <div>Prefilled Url</div>
        <div className="flex flex-row items-center gap-1">
          <CopyButton content={url} />
          <Link href={url} target="_blank" className="link">
            {url}
          </Link>
        </div>
      </div>
    </div>
  );
  await showConfirmDialog({ content });
};

type ResetButtonProps = {
  reset: () => void;
};
const ResetButton = ({ reset }: ResetButtonProps) => {
  return (
    <button
      className="btn btn-ghost"
      onClick={e => {
        reset();
        e.preventDefault();
      }}
    >
      reset
    </button>
  );
};

type PrefilledUrlButtonProps = {
  getValues: () => ParamObject;
  id_for_view: string;
  formDefinition?: FormDefinitionForView;
};
const PrefilledUrlButton = ({
  formDefinition,
  getValues,
  id_for_view,
}: PrefilledUrlButtonProps) => {
  const isConstant = (key: string, value: any) => {
    if (typeof value !== "string") return false;
    const item = formDefinition?.items?.find(item => item.id === key);
    if (!item) return false;
    return item.type === "constant" && item.value === value;
  };
  return (
    <button
      className="btn"
      onClick={e => {
        const values = Object.fromEntries(
          Object.entries(getValues()).filter(([key, value]) => !isConstant(key, value)),
        );
        const url = makePrefilledUrl(values, id_for_view);
        showUrl(url);
        e.preventDefault();
      }}
    >
      Get prefilled URL
    </button>
  );
};

type SubmitButtonProps = {
  isPending: boolean;
  isValid: boolean;
};
const SubmitButton = ({ isPending, isValid }: SubmitButtonProps) => {
  return (
    <button className="btn btn-primary" type="submit" disabled={!isValid || isPending}>
      {isPending ? (
        <span className="flex flex-row items-center gap-4">
          <span className="loading loading-spinner loading-xs"></span>Sending...
        </span>
      ) : (
        "send"
      )}
    </button>
  );
};

type DefinedFormProps = {
  onSubmit: ((data: { [x: string]: any }) => void) | undefined;
  formDefinition: FormDefinitionForView;
  defaultValues?: ParamObject;
  isPending?: boolean | undefined;
  submitErrors?: ActionError[] | null;
  id_for_view?: string | undefined;
  showPrefilledUrlButton?: boolean | undefined;
};
export function DefinedForm({
  formDefinition,
  onSubmit,
  defaultValues,
  isPending,
  submitErrors,
  id_for_view = "",
  showPrefilledUrlButton = false,
}: DefinedFormProps) {
  defaultValues = {
    ...Object.fromEntries(
      formDefinition?.items?.flatMap(item => ("value" in item ? [[item.id, item.value]] : [])),
    ),
    ...defaultValues,
  };
  const urlMakingMode = Boolean(showPrefilledUrlButton && id_for_view);
  const formItemsDefinition = formDefinition?.items;
  const visibilityAwareResolver = useMemo(
    () => makeVisibilityAwareResolver(formItemsDefinition),
    [formItemsDefinition],
  );
  const dependentKeys = useMemo(
    () => getVisibilityDependentKeys(formItemsDefinition),
    [formItemsDefinition],
  );
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: visibilityAwareResolver,
    mode: "onChange",
    defaultValues,
  });
  useWatch({ control, name: dependentKeys });
  const currentValues = getValues();
  const visibleItems = getVisibleItems(formItemsDefinition, currentValues);
  const handleFormSubmit = handleSubmit(data => {
    const submitVisibleIds = getVisibleIds(formItemsDefinition, data);
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) => submitVisibleIds.has(key)),
    );
    onSubmit?.(filteredData);
  });
  return (
    <form
      onSubmit={handleFormSubmit}
      className="grid gap-20 h-full overflow-auto print:overflow-hidden"
    >
      <div>
        <div className="text-4xl">{formDefinition.title}</div>
        <div>{styledText(formDefinition.description)}</div>
        <div className="grid gap-20">
          {visibleItems.map(item => (
            <FormItem {...{ register, errors, item, urlMakingMode }} key={item.id} />
          ))}
        </div>
      </div>
      <SubmitErrorAlert errors={submitErrors} />
      <div className="flex justify-end p-2 gap-3">
        <ResetButton reset={reset} />
        {urlMakingMode && <PrefilledUrlButton {...{ getValues, id_for_view, formDefinition }} />}
        <SubmitButton {...{ isPending: Boolean(isPending), isValid }} />
      </div>
    </form>
  );
}
