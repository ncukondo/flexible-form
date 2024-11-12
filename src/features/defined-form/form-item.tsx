"use client";
import {
  FieldError,
  FieldErrors,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegister,
} from "react-hook-form";
import { styledText } from "./styled-text";
import {
  ChoiceItemDefinition,
  ChoiceTableItemDefinition,
  ConstantItemDefinition,
  FormItemDefinition,
} from "../form-definition/schema";

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
            <tr key={subItem.id} id={`${subItem.id}`} className="border-y-[1px] border-base-200">
              <th
                className={`text-left left-0 sticky font-normal text-sm 
                ${error && subItem.id in error && "text-error"}`}
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
    <input
      disabled={!Boolean(urlMakingMode)}
      {...register(item.id, { value: item.value })}
      className={`w-full bg-transparent ${urlMakingMode ? "input input-bordered" : ""}`}
    />
  );
}

function Description({ description }: { description: string }) {
  return <div className="text-sm my-4  text-base-content/75">{styledText(description)}</div>;
}

function ItemTitle({ title, required }: { title: string; required: boolean }) {
  return (
    <div className="text-lg font-bold text-base-content/75">
      {styledText(title)}
      <span className="text-error">{required && "*"}</span>
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
  const error = (item.id in errors && errors[item.id as keyof typeof errors]) || undefined;

  return (
    <div>
      <ItemTitle title={item.title} required={item.required} />
      <div className="pl-4">
        <Description description={item.description} />
        <div className="text-error">{error?.message?.toString()}</div>
        {item.type === "short_text" && (
          <input {...register(item.id)} className="input input-bordered  w-full" />
        )}
        {item.type === "long_text" && (
          <textarea {...register(item.id)} className="textarea textarea-bordered w-full h-32" />
        )}
        {item.type === "constant" && <ConstantItem {...{ item, register, urlMakingMode }} />}
        {item.type === "choice" && <ChoiceFormItem {...{ item, register }} />}
        {item.type === "choice_table" && <ChoiceTableFormItem {...{ item, register, error }} />}
      </div>
    </div>
  );
}

export { FormItem };
