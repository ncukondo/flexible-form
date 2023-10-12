'use client'
import { useEffect } from "react";
import { initUseTomlText, useTomlDerivedJson, useTomlText } from "./store";
import { useFormDefinition } from "./form-definiton-store";
import { FormItemDefinition, makeFormItemsValueSchema } from "./form-definition-schema";
import { FieldErrors, FieldValues, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


type EditConfigProps = Omit<JSX.IntrinsicElements["textarea"], "value" | "onChange">;
function EditConfig(props: EditConfigProps) {
  const { toml, setToml } = useTomlText(s => ({ toml: s.toml, setToml: s.setToml }));
  useEffect(() => {
    initUseTomlText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useTomlText])
  return (
    <div className="h-full w-full">
      <textarea className="h-full w-full textarea font-mono" {...props} value={toml} onChange={e => setToml?.(e.target.value)} />
    </div>
  )
}

function ErrorDisplay() {
  const { error: syntaxError } = useTomlDerivedJson(s => ({ error: s.error }));
  const schemaError = useFormDefinition(s => s.error)
  return (
    <>{(syntaxError || schemaError) &&
      <div className="alert alert-error shadow-lg z-10 absolute bottom-2 m-4 w-[calc(100%-4rem)] max-h-32 overflow-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {syntaxError && "SyntaxError: " + syntaxError}
        {schemaError && "SchemaError: " + schemaError}
      </div>
    }
    </>
  )
}
function FormItem({ errors, item, register }: { item: FormItemDefinition, register: UseFormRegister<any>, errors: FieldErrors<FieldValues> }) {
  if (item.type === "constant") {
    return <div className="text-base mt-10">{item.question}: {item.value}<input type="hidden" value={item.value}  {...register(item.id)} /></div>
  }
  return (
    <div>
      <div className="text-base mt-10">{item.question}<span className="text-error">{item.required && "*"}</span></div>
      <div className="text-sm my-4">{item.description}</div>
      <div className="text-error">{item.id in errors && errors[item.id as keyof typeof errors]?.message?.toString()}</div>
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
      {item.type === "choice_table" && (
        <div className="overflow-x-auto">
          <table className="max-w-full">
            <thead className="overflow-auto">
              <tr>
                <th></th>
                {item.scales.map(scale => (<th key="scale" className="p-2"><span className="m-auto">{scale}</span></th>))}
              </tr>
            </thead>
            <tbody className="overflow-auto max-w-[80px]">
              {
                item.items.map((subItemId) => (
                  <tr key={subItemId}>
                    <th>{subItemId}</th>
                    {item.scales.map(scale => (
                      <td key={scale} className="p-2">
                        <div className="flex justify-center items-center">
                          <input
                            type={item.multiple ? "checkbox" : "radio"}
                            className={item.multiple ? "checkbox" : "radio"}
                            id={subItemId}
                            {...register(`${item.id}.${subItemId}`)} value={scale} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function EditForm() {
  const formDefinition = useFormDefinition(s => s.formDefinition);
  const formItemsDefinition = formDefinition?.items;
  const formItemValidator = makeFormItemsValueSchema(formItemsDefinition);
  const {
    register,
    handleSubmit,

    formState: { errors }
  } = useForm({ resolver: zodResolver(formItemValidator), mode: "onBlur" });
  return (
    <main className="min-h-[100dvh] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid">
      <div className="bg-yellow-100 w-full h-full relative p-2 min-h-[50dvh]">
        <EditConfig />
        <ErrorDisplay />
      </div>
      <div className="bg-red-100 w-full h-full p-2  max-h-[100dvh]">
        <div className="p-2  h-full">
          {
            formDefinition &&
            <form onSubmit={handleSubmit(data => alert(JSON.stringify(data, null, 2)))} className="h-full overflow-auto">
              <div>
                <div className="text-4xl">{formDefinition.title}</div>
                <div>{formDefinition.description}</div>
                <div>{formDefinition.items.map((item) => <FormItem register={register} errors={errors} key={item.id} item={item} />)}</div>
              </div>
              <div className="flex justify-end p-2"><button className="btn">send</button></div>
            </form>
          }
        </div>
      </div>
    </main>

  )
}