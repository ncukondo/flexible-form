"use server";
import { redirect } from "next/navigation";

import { makeFormItemsValueSchema, makeFormItemsValueSchemaKeys } from "./form-value-schema";
import { sendSystemMessageMail } from "./send-mail";
import { FormDefinitionForView } from "../../features/form-definition/schema";
import { getFormAction } from "../../features/form-definition/server/get";

const parseValue = (formValue: unknown, formDefinition: FormDefinitionForView) => {
  const parsed = makeFormItemsValueSchema(formDefinition.items).parse(formValue);
  const keys = makeFormItemsValueSchemaKeys(formDefinition.items);
  const schema = formDefinition.items;
  return { value: parsed, keys, schema };
};

async function submitFormAction(
  idForView: string,
  formValue: unknown,
  formDefinition: FormDefinitionForView,
) {
  const actions = await getFormAction(idForView);
  const { value, keys, schema } = parseValue(formValue, formDefinition);
  const payload = {
    form: idForView,
    title: formDefinition.title,
    description: formDefinition.description,
    value,
    keys,
    schema,
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
          console.log("submit Https action", action, "payload", JSON.stringify(payload, null, 2));
          const res = await fetch(action, { method: "POST", body: JSON.stringify(payload) });
          if (res.status !== 200) {
            console.error("submit Https action", action, "status", res.status);
            throw new Error(`Failed to submit Https action status ${res.status}`);
          } else {
            console.log("submit Https action", action, "status", res.status);
          }
          return res;
        }
        throw new Error(`Unknown action tag: ${tag}`);
      }),
  );
  redirect("/view/thank-you?id_for_view=" + idForView);

}

export { submitFormAction };
