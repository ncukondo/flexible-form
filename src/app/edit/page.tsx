import EditByTomlForm from "./edit-by-toml";

export default function EditForm({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }; }) {
  return <EditByTomlForm defaultValues={searchParams} />
}