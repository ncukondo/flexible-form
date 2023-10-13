import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, FieldErrors, FieldErrorsImpl, FieldValues, Merge, useForm, UseFormRegister } from "react-hook-form";
import { ChoiceTableItemDefinition, FormDefinition, FormItemDefinition, makeFormItemsValueSchema } from "./form-definition-schema";


function ChoiceTableFormItem({ error, item, register }: { item: ChoiceTableItemDefinition; register: UseFormRegister<any>; error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; }) {
  return (
    <div className="overflow-x-auto">
      <table className="max-w-full table-fixed">
        <thead className="text-sm">
          <tr>
            <th className="sticky top-0"></th>
            {item.scales.map(scale => (<th key="scale" className="z-10 sticky top-0 font-normal p-2"><span className="m-auto">{scale}</span></th>))}
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {item.items.map((subItemId) => (
            <tr key={subItemId} id={`${item.id}.${subItemId}`}>
              <th className={`left-0 sticky font-normal text-sm ${error && subItemId in error && "text-error"}`}>
                {subItemId}
              </th>
              {item.scales.map(scale => (
                <td key={scale} className="p-2">
                  <div className="flex justify-center items-center">
                    <input
                      type={item.multiple ? "checkbox" : "radio"}
                      className={item.multiple ? "checkbox" : "radio"}
                      {...register(`${item.id}.${subItemId}`)} value={scale} />
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
function FormItem({ errors, item, register }: { item: FormItemDefinition; register: UseFormRegister<any>; errors: FieldErrors<FieldValues>; }) {
  if (item.type === "constant") {
    return <div className="text-base mt-10">{item.question}: {item.value}<input type="hidden" value={item.value} {...register(item.id)} /></div>;
  }
  const error = item.id in errors && errors[item.id as keyof typeof errors] || undefined;
  return (
    <div>
      <div className="text-base mt-10">{item.question}<span className="text-error">{item.required && "*"}</span></div>
      <div className="text-sm my-4">{item.description}</div>
      <div className="text-error">{error?.message?.toString()}</div>
      {item.type === "short_text" && <input {...register(item.id)} className="input input-bordered  w-full" />}
      {item.type === "long_text" && <textarea {...register(item.id)} className="textarea textarea-bordered w-full h-32" />}
      {item.type === "choice" && item.items.map((choice) => (
        <div key={choice}>
          <label className="label cursor-pointer justify-start gap-x-3">
            <input
              type={item.multiple ? "checkbox" : "radio"}
              className={item.multiple ? "checkbox" : "radio"}
              {...register(item.id)}
              value={choice}
              id={item.id} />
            <span className="label-text">{choice}</span>
          </label>
        </div>
      ))}
      {item.type === "choice_table" && <ChoiceTableFormItem {...{ item, register, error }} />}
    </div>
  );
}
export function DefinedForm({ formDefinition, onSubmit }: { onSubmit: ((data: { [x: string]: any; }) => void) | undefined; formDefinition: FormDefinition; }) {
  const formItemsDefinition = formDefinition?.items;
  const formItemValidator = makeFormItemsValueSchema(formItemsDefinition);
  const {
    register, handleSubmit, formState: { errors }
  } = useForm({ resolver: zodResolver(formItemValidator), mode: "onBlur" });
  return (
    <form onSubmit={handleSubmit(data => onSubmit?.(data))} className="h-full overflow-auto">
      <div>
        <div className="text-4xl">{formDefinition.title}</div>
        <div>{formDefinition.description}</div>
        <div>{formDefinition.items.map((item) => <FormItem register={register} errors={errors} key={item.id} item={item} />)}</div>
      </div>
      <div className="flex justify-end p-2"><button className="btn">send</button></div>
    </form>
  );
}