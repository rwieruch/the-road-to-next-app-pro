import { redirect } from "next/navigation";
import { emailVerificationPath, signInPath } from "@/paths";
import { getAuth } from "./get-auth";

export const getAuthOrRedirect = async () => {
  const auth = await getAuth();

  if (!auth.user) {
    redirect(signInPath());
  }

  if (!auth.user.emailVerified) {
    redirect(emailVerificationPath());
  }

  return auth;
};
