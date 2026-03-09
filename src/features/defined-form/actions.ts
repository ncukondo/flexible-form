"use server";
import { redirect } from "next/navigation";

import "@/common/url/init-server-url";
import { makePrefilledUrl } from "@/common/url";
import { makeFormItemsValueSchema, makeFormItemsValueSchemaKeys } from "./form-value-schema";
import { sendSystemMessageMail } from "./send-mail";
import { FormDefinitionForView } from "../../features/form-definition/schema";
import { getFormAction } from "../../features/form-definition/server/get";

type ActionError = {
  type: "email" | "webhook" | "unknown";
  detail: string;
};

type SubmitFormResult = {
  success: false;
  errors: ActionError[];
};

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
): Promise<SubmitFormResult | void> {
  const actions = await getFormAction(idForView);
  const { value, keys, schema } = parseValue(formValue, formDefinition);
  const payload = {
    form: idForView,
    title: formDefinition.title,
    description: formDefinition.description,
    value,
    keys,
    schema,
    prefilledUrl: makePrefilledUrl(value, idForView),
  };

  const parsedActions = actions.map(action => {
    const [tag, target] = action.split(":").map(s => s.trim());
    return { tag: tag.toLowerCase(), target, action };
  });

  const results = await Promise.allSettled(
    parsedActions.map(async ({ tag, target, action }) => {
      if (tag === "mailto") {
        await sendSystemMessageMail(
          target,
          JSON.stringify(payload, null, 2),
          `System Mail from THERS Form Name: ${formDefinition.title}`,
        );
        return;
      }
      if (tag === "log") {
        console.log(JSON.stringify(payload, null, 2));
        return;
      }
      if (tag === "https") {
        console.log("submit Https action", action, "payload", JSON.stringify(payload, null, 2));
        const res = await fetch(action, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
        if (res.status !== 200) {
          const body = await res.text();
          console.error("Error: submit Https action", action, "status", res.status, "body", body);
          throw new Error(`HTTP ${res.status}`);
        }
        console.log("Success: submit Https action", action, "status", res.status);
        return;
      }
      throw new Error(`Unknown action tag: ${tag}`);
    }),
  );

  const errors: ActionError[] = [];
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      const { tag } = parsedActions[i];
      const detail = result.reason instanceof Error ? result.reason.message : String(result.reason);
      if (tag === "mailto") {
        errors.push({ type: "email", detail });
      } else if (tag === "https") {
        errors.push({ type: "webhook", detail });
      } else {
        errors.push({ type: "unknown", detail });
      }
    }
  });

  if (errors.length > 0) {
    return { success: false, errors };
  }

  redirect("/view/thank-you?id_for_view=" + idForView);
}

export { submitFormAction };
export type { SubmitFormResult, ActionError };
