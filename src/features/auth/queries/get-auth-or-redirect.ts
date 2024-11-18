import { redirect } from "next/navigation";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organizations-by-user";
import { emailVerificationPath, onboardingPath, signInPath } from "@/paths";
import { getAuth } from "./get-auth";

type GetAuthOrRedirectOptions = {
  checkEmailVerified?: boolean;
  checkOrganization?: boolean;
};

export const getAuthOrRedirect = async (options?: GetAuthOrRedirectOptions) => {
  const { checkEmailVerified = true, checkOrganization = true } = options ?? {};

  const auth = await getAuth();

  if (!auth.user) {
    redirect(signInPath());
  }

  if (checkEmailVerified && !auth.user.emailVerified) {
    redirect(emailVerificationPath());
  }

  if (checkOrganization) {
    const organizations = await getOrganizationsByUser();

    if (!organizations.length) {
      redirect(onboardingPath());
    }
  }

  return auth;
};
