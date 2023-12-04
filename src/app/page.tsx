import { LogInPanel } from "../features/user/login-forms";
import { getUser } from "../features/user/user";



export default async function Home() {
  const buttonToEditForm = true;
  const user = await getUser();
  return (
    <div>
      <LogInPanel {...{ user, buttonToEditForm }} />
    </div>
  );
}
