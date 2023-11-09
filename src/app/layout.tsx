import "./globals.css";
import type { Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ToastProvider } from "@/app/_ui/toast";
import { ModalProvider } from "@/app/_ui/modal";
import { Suspense } from "react";
import "@/app/_url/init-server-url";

export const metadata: Metadata = {
  title: "Flexible Form",
  description: "Flexible Form",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <UserProvider>
        <body className="m-0 p-0 min-h-[100dvh]">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <ModalProvider />
          <ToastProvider />
        </body>
      </UserProvider>
    </html>
  );
}
