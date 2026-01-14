import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Documentum",
  description: "Sign in to your Documentum account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
