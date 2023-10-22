import EditByTomlForm from "./edit-by-toml";
import { z } from "zod";
import { getFormDefinitionForEdit } from "@service/registered-form-definition";
import { toUUID } from "@lib/uuid";
import { headers } from "next/headers";
import { getUser } from "../_service/user";

const extractIdForEdit = (urlParams: unknown) => {
  const res = z.object({ id_for_edit: z.string() }).safeParse(urlParams);
  if (!res.success) return null;
  return toUUID(res.data.id_for_edit);
};

const extractRegisteredFormDefinitionForEdit = async (urlParams: unknown) => {
  const id_for_edit = extractIdForEdit(urlParams);
  if (!id_for_edit) return null;
  return await getFormDefinitionForEdit(id_for_edit);
};

const NudgeLogin = ({ returnTo }: { returnTo: string }) => {
  return (
    <div className="grid justify-center items-center min-h-[100dvh]">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">Flexible Form</h1>
        <div>Please Login before making form.</div>
        <a href={`/api/auth/login?returnTo=${returnTo}`} className="btn btn-primary">
          Login
        </a>
      </div>
    </div>
  );
};

const currentUrl = () => {
  const url = new URL(headers().get("x-url") || "");
  return url;
};

type SearchParams = { [key: string]: string | string[] | undefined };
export default async function EditForm({ searchParams }: { searchParams: SearchParams }) {
  const formDefinitionForEdit = await extractRegisteredFormDefinitionForEdit(searchParams);
  const path = currentUrl().pathname + currentUrl().search;
  const user = await getUser();
  if (!user) return <NudgeLogin returnTo={path} />;

  return (
    <EditByTomlForm defaultValues={searchParams} formDefinitionForEdit={formDefinitionForEdit} />
  );
}
