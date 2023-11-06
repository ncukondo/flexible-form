"use client";
//import { User } from "@service/user";
import { signIn, useSession, signOut } from "next-auth/react";
const LoginWithNextAuth = () => {
  const { data: session } = useSession();

  return (
    <div className="grid justify-center items-center min-h-[100dvh] p-4">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">Flexible Form</h1>
        {!session && (
          <button onClick={() => signIn()} className="btn btn-primary">
            Sign In
          </button>
        )}
        {session && (
          <button onClick={() => signOut()} className="btn btn-primary">
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export const LogInPage = async ({ buttonToEditForm = true }: { buttonToEditForm?: boolean }) => {
  return <LoginWithNextAuth />;
};
