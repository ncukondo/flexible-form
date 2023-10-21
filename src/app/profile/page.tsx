"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LineWave } from "react-loader-spinner";

const projectID = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID;

interface User {
  userID: any;
  email: any;
  ID: string;
  created: string;
  emails: Email[];
  fullName: string;
  name: string;
  phoneNumbers: PhoneNumber[];
  status: string;
  updated: string;
}

interface Email {
  ID: string;
  created: string;
  email: string;
  status: string;
  updated: string;
}

interface PhoneNumber {
  ID: string;
  phoneNumber: string;
  status: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // セッション管理
  useEffect(() => {
    setLoading(true);
    // クライアントのみで実行
    import("@corbado/webcomponent")
      .then(module => {
        const Corbado = module.default || module;
        const sessionInstance = new Corbado.Session(projectID);
        setSession(sessionInstance);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (session) {
      setLoading(true);
      // @ts-ignore
      session.refresh((user: any) => {
        setUser(user);
        setLoading(false);
      });
    }
  }, [session]);

  const handleLogout = async () => {
    setLoading(true);
    // @ts-ignore
    await session.logout();

    setUser(null);
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="grid justify-center items-center min-h-[100dvh]">
      {loading && <LineWave />}

      {!loading && user && (
        <div>
          <h1 className="text-4xl">Login Successed</h1>
          <div>
            <p>
              ユーザーID: {user.userID}
              <br />
              Email: {user.email}
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </p>
          </div>
          <button className="btn" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      )}

      {!loading && !user && (
        <div>
          <p>ログインされていません</p>
          <p>
            Please go back to <a href="/">ログインする</a>
          </p>
        </div>
      )}
    </div>
  );
}
