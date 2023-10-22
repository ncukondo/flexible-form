import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ToastProvider } from "./_components/toast";
import { ModalProvider } from "./_components/modal-dialog";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flexible Form",
  description: "Flexible Form",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <UserProvider>
        <body className={inter.className}>
          {children}
          <ModalProvider />
          <ToastProvider />
        </body>
      </UserProvider>
    </html>
  );
}
