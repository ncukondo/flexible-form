"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldError,
  FieldErrors,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  useForm,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import {
  ChoiceItemDefinition,
  ChoiceTableItemDefinition,
  ConstantItemDefinition,
  FormDefinitionForView,
  FormItemDefinition,
} from "../form-definition/schema";
import { makeFormItemsValueSchema } from "./form-value-schema";
import "@service/url/init-client-url";
import { makePrevilledUrl } from "@service/url";
import { ParamObject } from "@lib/flatten-object";
import { showConfirmDialog } from "../_components/confirm-dialog";
import Link from "next/link";
import { CopyButton } from "../_components/copy-button";
import { useEffect } from "react";

function ChoiceTableFormItem({
  error,
  item,
  register,
}: {
  item: ChoiceTableItemDefinition;
  register: UseFormRegister<any>;
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="max-w-full table-fixed">
        <thead className="text-sm">
          <tr>
            <th className="sticky top-0"></th>
            {item.scales.map(scale => (
              <th key={scale} className="z-10 sticky top-0 font-normal p-2">
                <span className="m-auto">{scale}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {item.items.map(subItemId => (
            <tr key={subItemId} id={`${item.id}.${subItemId}`}>
              <th
                className={`left-0 sticky font-normal text-sm ${
                  error && subItemId in error && "text-error"
                }`}
              >
                {subItemId}
              </th>
              {item.scales.map(scale => (
                <td key={scale} className="p-2">
                  <div className="flex justify-center items-center">
                    <input
                      type={item.multiple ? "checkbox" : "radio"}
                      className={item.multiple ? "checkbox" : "radio"}
                      {...register(`${item.id}.${subItemId}`)}
                      value={scale}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChoiceFormItem({
  item,
  register,
}: {
  item: ChoiceItemDefinition;
  register: UseFormRegister<any>;
}) {
  return item.items.map(choice => (
    <div key={choice}>
      <label className="label cursor-pointer justify-start gap-x-3">
        <input
          type={item.multiple ? "checkbox" : "radio"}
          className={item.multiple ? "checkbox" : "radio"}
          {...register(item.id)}
          value={choice}
          id={item.id + "." + choice}
        />
        <span className="label-text">{choice}</span>
      </label>
    </div>
  ));
}

type ConstantItemProps = {
  item: ConstantItemDefinition;
  register: UseFormRegister<any>;
};
function ConstantItem({ item, register }: ConstantItemProps) {
  return (
    <div className="text-base mt-10">
      {item.title}:{" "}
      <input {...register(item.id, { value: item.value })} className={`bg-transparent`} />
    </div>
  );
}

type FormItemProps = {
  item: FormItemDefinition;
  register: UseFormRegister<any>;
  errors: FieldErrors<FieldValues>;
};
function FormItem({ errors, item, register }: FormItemProps) {
  if (item.type === "constant") return <ConstantItem {...{ item, register }} />;
  const error = (item.id in errors && errors[item.id as keyof typeof errors]) || undefined;

  return (
    <div>
      <div className="text-base mt-10">
        {item.title}
        <span className="text-error">{item.required && "*"}</span>
      </div>
      <div className="text-sm my-4">{item.description}</div>
      <div className="text-error">{error?.message?.toString()}</div>
      {item.type === "short_text" && (
        <input {...register(item.id)} className="input input-bordered  w-full" />
      )}
      {item.type === "long_text" && (
        <textarea {...register(item.id)} className="textarea textarea-bordered w-full h-32" />
      )}
      {item.type === "choice" && <ChoiceFormItem {...{ item, register }} />}
      {item.type === "choice_table" && <ChoiceTableFormItem {...{ item, register, error }} />}
    </div>
  );
}

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

const ResetButton = ({ reset }: { reset: UseFormReset<ParamObject> }) => {
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
        const url = makePrevilledUrl(values, id_for_view);
        showUrl(url);
        e.preventDefault();
      }}
    >
      Get prefilled URL
    </button>
  );
};

type DefinedFormProps = {
  onSubmit: ((data: { [x: string]: any }) => void) | undefined;
  formDefinition: FormDefinitionForView;
  defaultValues?: ParamObject;
  isPending?: boolean | undefined;
  id_for_view?: string | undefined;
  showPrefilledUrlButton?: boolean | undefined;
};
export function DefinedForm({
  formDefinition,
  onSubmit,
  defaultValues,
  isPending,
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
  const formItemValidator = makeFormItemsValueSchema(formItemsDefinition);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm({ resolver: zodResolver(formItemValidator), mode: "onBlur", defaultValues });
  useEffect(() => {
    formDefinition?.items
      ?.flatMap(item =>
        item.type === "constant" && "value" in item ? [[item.id, item.value]] : [],
      )
      .forEach(([id, value]) => {
        setValue(id, value);
      });
  }, [formDefinition]);
  return (
    <form onSubmit={handleSubmit(data => onSubmit?.(data))} className="h-full overflow-auto">
      <div>
        <div className="text-4xl">{formDefinition.title}</div>
        <div>{formDefinition.description}</div>
        <div>
          {formDefinition.items.map(item => (
            <FormItem {...{ register, errors, item }} key={item.id} />
          ))}
        </div>
      </div>
      <div className="flex justify-end p-2 gap-3">
        <ResetButton reset={reset} />
        {urlMakingMode && <PrefilledUrlButton {...{ getValues, id_for_view, formDefinition }} />}
        <button className="btn btn-primary" disabled={!isValid || isPending}>
          {isPending ? (
            <span className="flex flex-row items-center gap-4">
              <span className="loading loading-spinner loading-xs"></span>Sending...
            </span>
          ) : (
            "send"
          )}
        </button>
      </div>
    </form>
  );
}
