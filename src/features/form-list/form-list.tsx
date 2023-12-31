import Link from "next/link";
import { getEditUrl } from "@/common/url";
import { getUserForms } from "../form-definition/server";
import { getUser } from "../user/user";

type FormInfo = {
  description: string;
  created_at: Date;
  updated_at: Date;
  title: string;
  id_for_edit: string;
  id_for_view: string;
};

const formatDateTime = (date: Date) => {
  date.setTime(date.getTime() + 1000*60*60*9);// convert to JST
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const FormRow = ({ title, description, id_for_edit, created_at, updated_at }: FormInfo) => {
  return (
    <tr>
      <th>
        <Link className="link" href={getEditUrl(id_for_edit)}>
          {title}
        </Link>
      </th>
      <td>{description}</td>
      <td>{formatDateTime(updated_at)}</td>
      <td>{formatDateTime(created_at)}</td>
    </tr>
  );
};

const FormHeader = () => {
  return (
    <tr>
      <th>Title</th>
      <th>Description</th>
      <th>Updated At</th>
      <th>Created At</th>
    </tr>
  );
};

const FormList = async () => {
  const user = await getUser();
  if (!user) return <div></div>;
  const formList = await getUserForms(user);
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <FormHeader />
        </thead>
        <tbody>
          {formList.map(form => (
            <FormRow key={form.id_for_edit} {...form} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormList;
