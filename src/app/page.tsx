import { getUser } from "./_user/user";
import { LogInPage } from "./_user/login-forms";

export default async function Home() {
  const buttonToEditForm = true;
  const user = await getUser();
  return <LogInPage {...{ user, buttonToEditForm }} />;
}
