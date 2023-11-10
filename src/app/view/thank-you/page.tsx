import { z } from "zod";
import { getPostSubmit } from "@/features/form-definition/server/get";

type SearchParams = { [key: string]: string | string[] | undefined };

const extractIdForView = (urlParams: unknown) => {
  const res = z.object({ id_for_view: z.string() }).safeParse(urlParams);
  if (!res.success) return null;
  return res.data.id_for_view;
};

const extractMessage = async (urlParams: unknown) => {
  const id_for_view = extractIdForView(urlParams);
  if (!id_for_view) return null;
  const postSubmitInfo = await getPostSubmit(id_for_view);
  const defaultMessage = "Thank you for your submission!";
  return postSubmitInfo?.message || defaultMessage;
};

export default function ThankYou({ searchParams }: { searchParams: SearchParams }) {
  const message = extractMessage(searchParams);
  return (
    <div className="grid justify-center items-center min-h-[100dvh] p-4">
      <div className="flex flex-col gap-5">{message}</div>
    </div>
  );
}
