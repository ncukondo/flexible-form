import { User, isUserInWhileListForEdit, whilteListDomain } from "./user";
import { loginUrl, logoutUrl } from "../_url";
import { Suspense } from "react";
import FormList from "../_form-list/form-list";

const CautionMessage = () => {
  const cautionMessage = `Only verified emails ends with ${whilteListDomain.join(
    ",",
  )} are allowed to edit form.`;
  return (
    <div className="alert alert-info">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-current shrink-0 w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>{cautionMessage}</span>
    </div>
  );
};
const Login = () => {
  return (
    <>
      <div>Please Login before making form.</div>
      <CautionMessage />
      <a href={loginUrl()} className="btn btn-primary">
        Login
      </a>
    </>
  );
};
const UserStatus = ({
  buttonToEditForm = true,
  user,
}: {
  user: User;
  buttonToEditForm?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div>You are logged in.</div>
        <div>Email: {user.email}</div>
        <div>Email verified: {user.email_verified ? "ok" : "Please verify email."}</div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-5">
        {isUserInWhileListForEdit(user) ? (
          buttonToEditForm && (
            <a href="/edit" className="btn btn-primary">
              Make new form.
            </a>
          )
        ) : (
          <CautionMessage />
        )}
        <a href={logoutUrl()} className="btn">
          Logout
        </a>
      </div>
    </div>
  );
};
export const LogInPage = async ({
  buttonToEditForm = true,
  user,
}: {
  user: User | null;
  buttonToEditForm?: boolean;
}) => {
  return (
    <div className="grid justify-center items-center min-h-[100dvh] p-5">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">Flexible Form</h1>
        {user ? <UserStatus {...{ user, buttonToEditForm }} /> : <Login />}
      </div>
      {user && isUserInWhileListForEdit(user) && (
        <div className="my-10">
          <Suspense fallback="Loading...">
            <FormList />
          </Suspense>
        </div>
      )}
    </div>
  );
};
