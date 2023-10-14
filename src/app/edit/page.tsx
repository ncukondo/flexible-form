import EditByTomlForm from "./edit-by-toml";

type SearchParams = { [key: string]: string | string[] | undefined };
export default function EditForm({ searchParams }: { searchParams: SearchParams }) {
  return <EditByTomlForm defaultValues={searchParams} />;
}
