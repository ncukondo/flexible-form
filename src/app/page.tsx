"use client";

import "@corbado/webcomponent/pkg/auth_cui.css";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // クライアントのみで実行
    import("@corbado/webcomponent")
      .then(resp => {
        console.log(resp);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div className="grid justify-center items-center min-h-[100dvh]">
      <corbado-auth project-id={process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID} conditional="yes">
        <input
          name="username"
          id="corbado-username"
          data-input="username"
          required
          autoComplete="webauthn"
        />
      </corbado-auth>
    </div>
  );
}
