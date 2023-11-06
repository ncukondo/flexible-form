"use client";

import Link from "next/link";

export default function Error() {
  return (
    <div className="grid justify-center items-center min-h-[100dvh] p-4">
      <div className="flex flex-col gap-5">
        <div className="text-error">
          Cannot access form. Check wether you have access permission and form exists.
        </div>
        <Link className="link" href="/">
          Go back to top.
        </Link>
      </div>
    </div>
  );
}
