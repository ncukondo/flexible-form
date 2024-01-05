"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import { ParamObject } from "@/common/flatten-object";
import { makePrevilledUrl } from "@/common/url";
import { makeFormItemsValueSchema } from "./form-value-schema";
import { styledText } from "./styled-text";
import {
  ChoiceItemDefinition,
  ChoiceTableItemDefinition,
  ConstantItemDefinition,
  FormDefinitionForView,
  FormItemDefinition,
} from "../../features/form-definition/schema";
import "@/common/url/init-client-url";
import { showConfirmDialog } from "../../ui/confirm-dialog";
import { CopyButton } from "../../ui/copy-button";

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
            {item.choices.map(choice => (
              <th key={choice.title} className="z-10 sticky top-0 font-normal p-2">
                <span className="m-auto">{choice.title}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {item.items.map(subItem => (
            <tr key={subItem.id} id={`${subItem.id}`}>
              <th
                className={`left-0 sticky font-normal text-sm ${
                  error && subItem.id in error && "text-error"
                }`}
              >
                {subItem.title}
              </th>
              {item.choices.map(choice => (
                <td key={choice.value} className="p-2">
                  <div className="flex justify-center items-center">
                    <input
                      type={item.multiple ? "checkbox" : "radio"}
                      className={item.multiple ? "checkbox" : "radio"}
                      {...register(`${subItem.id}`)}
                      value={choice.value}
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
  return item.choices.map(choice => (
    <div key={choice.value}>
      <label className="label cursor-pointer justify-start gap-x-3">
        <input
          type={item.multiple ? "checkbox" : "radio"}
          className={item.multiple ? "checkbox" : "radio"}
          {...register(item.id)}
          value={choice.value}
          id={item.id + "." + choice.value}
        />
        <span className="label-text">{choice.title}</span>
      </label>
    </div>
  ));
}

type ConstantItemProps = {
  item: ConstantItemDefinition;
  register: UseFormRegister<any>;
  urlMakingMode?: boolean;
};
function ConstantItem({ urlMakingMode, item, register }: ConstantItemProps) {
  return (
    <div className="text-base mt-10">
      {item.title}:{" "}
      <input
        disabled={!Boolean(urlMakingMode)}
        {...register(item.id, { value: item.value })}
        className={`bg-transparent ${urlMakingMode ? "input input-bordered" : ""}`}
      />
    </div>
  );
}

type FormItemProps = {
  item: FormItemDefinition;
  register: UseFormRegister<any>;
  errors: FieldErrors<FieldValues>;
  urlMakingMode?: boolean;
};
function FormItem({ errors, item, register, urlMakingMode }: FormItemProps) {
  if (item.type === "constant") return <ConstantItem {...{ item, register, urlMakingMode }} />;
  const error = (item.id in errors && errors[item.id as keyof typeof errors]) || undefined;

  return (
    <div>
      <div className="text-base mt-10">
        {styledText(item.title)}
        <span className="text-error">{item.required && "*"}</span>
      </div>
      <div className="text-sm my-4">{styledText(item.description)}</div>
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
    formState: { errors, isValid },
    reset,
  } = useForm({ resolver: zodResolver(formItemValidator), mode: "onBlur", defaultValues });
  return (
    <form onSubmit={handleSubmit(data => onSubmit?.(data))} className="h-full overflow-auto">
      <div>
        <div className="text-4xl">{formDefinition.title}</div>
        <div>{styledText(formDefinition.description)}</div>
        <div>
          {formDefinition.items.map(item => (
            <FormItem {...{ register, errors, item, urlMakingMode }} key={item.id} />
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
