import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await getAuthOrRedirect();

  return <>{children}</>;
}
