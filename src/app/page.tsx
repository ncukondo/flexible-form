import { auth,signOut,signIn } from "@/features/user/auth"
import { LogInPage } from "../features/user/login-forms";
import { getUser } from "../features/user/user";

function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button className="btn btn-ghost">
        Sign Out
      </button>
    </form>
  );
}

function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("email",{email:"ncukondo@gmail.com"});
      }}
    >
      <button className="btn btn-primary">
        Sign In
      </button>
    </form>
  );
}



export default async function Home() {
  const buttonToEditForm = true;
  const user = await getUser();
  const session = await auth();
  return (
    <div>
      <SignIn />
      <SignOut />
      <pre>{JSON.stringify(session?.user,null,2)}</pre>
      <LogInPage {...{ user, buttonToEditForm }} />
    </div>
  );
}
