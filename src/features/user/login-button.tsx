"use client";

import { useFormStatus } from "react-dom";

const LoginButton = () => {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? "Sending..." : "Login"}
    </button>
  );
};

export { LoginButton };
