import { auth } from "./auth";


type User = {
  name: string;
  email: string;
  email_verified: string;
  sub: string;
};

const whilteListDomain = ["nagoya-u.ac.jp", "thers.ac.jp", "sri-net.jp"];

const getUser = async () => {
  const session = await auth();
  if (!session?.user) {
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
