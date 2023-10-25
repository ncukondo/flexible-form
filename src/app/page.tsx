import { getUser } from "@service/user";
import { LogInPage } from "@components/features/login-forms";

export default async function Home() {
  const buttonToEditForm = true;
  const user = await getUser();
  return <LogInPage {...{ user, buttonToEditForm }} />;
}
