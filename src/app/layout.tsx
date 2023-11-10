import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ModalProvider } from "@/ui/modal";
import { ToastProvider } from "@/ui/toast";
import "@/common/url/init-server-url";

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
