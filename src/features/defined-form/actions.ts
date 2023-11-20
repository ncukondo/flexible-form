"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { makeFormItemsValueSchema } from "./form-value-schema";
import { sendSystemMessageMail } from "./send-mail";
import { FormDefinitionForView } from "../../features/form-definition/schema";
import { getFormAction } from "../../features/form-definition/server/get";

const parseValue = (formValue: unknown, formDefinition: FormDefinitionForView) => {
  const parsed = makeFormItemsValueSchema(formDefinition.items).parse(formValue);
  const details = formDefinition.items.map(item => {
    const value = parsed[item.id as keyof typeof parsed];
    return { ...item, value };
  });
  return { value: parsed, details };
};

async function submitFormAction(
  idForView: string,
  formValue: unknown,
  formDefinition: FormDefinitionForView,
) {
  const actions = await getFormAction(idForView);
  const { value, details } = parseValue(formValue, formDefinition);
  const payload = {
    form: idForView,
    title: formDefinition.title,
    description: formDefinition.description,
    value,
    details,
  };
  await Promise.all(
    actions
      .map(action => {
        const [tag, target] = action.split(":").map(s => s.trim());
        return { tag: tag.toLowerCase(), target, action };
      })
      .map(async ({ tag, target, action }) => {
        if (tag === "mailto")
          return await sendSystemMessageMail(
            target,
            JSON.stringify(payload, null, 2),
            `System Mail from THERS Form Name: ${formDefinition.title}`,
          );
        if (tag === "log") return console.log(JSON.stringify(payload, null, 2));
        if (tag === "https") {
          return await fetch(action, { method: "POST", body: JSON.stringify(payload) });
        }
        throw new Error(`Unknown action tag: ${tag}`);
      }),
  );
  revalidatePath("/");
  redirect("/view/thank-you?id_for_view=" + idForView);
  return true;
}

export { submitFormAction };