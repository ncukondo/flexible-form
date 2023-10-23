import { getSession } from "@auth0/nextjs-auth0";

type User = {
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  sub: string;
  sid: string;
};

const whilteListDomain = ["nagoya-u.ac.jp", "thers.ac.jp", "sri-net.jp"];

const getUser = async () => {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return session.user as User;
};

const isUserInWhileListForEdit = (user: User) => {
  if (!user.email_verified) {
    return false;
  }
  const email = user.email;
  return whilteListDomain.some(domain => email.endsWith(domain));
};

export { getUser, isUserInWhileListForEdit, whilteListDomain, type User };
