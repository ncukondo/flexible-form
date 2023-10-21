import { getUser } from "@service/user";

export default async function Home() {
  const user = await getUser();
  return (
    <div className="grid justify-center items-center min-h-[100dvh]">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">Flexible Form</h1>
        {user && (
          <div>
            <div>name: {user.name}</div>
            <div>user email: {user.email}</div>
            <div>id: {user.sub}</div>
          </div>
        )}
        {user && (
          <a href="/edit" className="btn btn-primary">
            Make new form.
          </a>
        )}
        {user ? (
          <a href="/api/auth/logout" className="btn">
            Logout
          </a>
        ) : (
          <>
            <div>Please Login before making form.</div>
            <a href="/api/auth/login" className="btn btn-ghost">
              Login
            </a>
          </>
        )}
      </div>
    </div>
  );
}
