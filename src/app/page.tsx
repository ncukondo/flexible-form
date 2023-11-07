import { getUser } from "./_user/user";
import { LogInPage } from "./_user/login-forms";
import FormList from "./_form-list/form-list";
import { Suspense } from "react";

export default async function Home() {
  const buttonToEditForm = true;
  const user = await getUser();
  return (
    <div>
      <LogInPage {...{ user, buttonToEditForm }} />
    </div>
  );
}
