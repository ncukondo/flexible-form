"use server";

import { revalidatePath } from "next/cache";
import { FormDefinitionForView } from "../form-definition/schema";
import { makeFormItemsValueSchema } from "../edit/form-value-schema";
import { sendSystemMessageMail } from "./send-mail";
import { toShortUUID } from "../form-definition/server/uuid";
import { redirect } from "next/navigation";
import { getFormAction } from "../form-definition/server/get";

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
        return { tag: tag.toLowerCase(), target };
      })
      .map(async ({ tag, target }) => {
        if (tag === "mailto")
          return await sendSystemMessageMail(
            target,
            JSON.stringify(payload, null, 2),
            `System Mail from THERS Form Name: ${formDefinition.title}`,
          );
        if (tag === "log") return console.log(JSON.stringify(payload, null, 2));
        return await fetch(target, { method: "POST", body: JSON.stringify(payload) });
      }),
  );
  revalidatePath("/");
  redirect("/view/thank-you");
  return true;
}

export { submitFormAction };
