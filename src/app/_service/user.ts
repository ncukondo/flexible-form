import { getSession } from "@auth0/nextjs-auth0";

const getUser = async () => {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return session.user;
};

export { getUser };
