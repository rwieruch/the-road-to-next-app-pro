import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { OrganizationList } from "@/features/organization/components/organization-list";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organizations-by-user";
import { onboardingPath, organizationsPath } from "@/paths";

const SelectActiveOrganizationPage = async () => {
  const organizations = await getOrganizationsByUser();

  const hasActive = organizations.some((organization) => {
    return organization.membershipByUser.isActive;
  });

  if (hasActive) {
    redirect(organizationsPath());
  }

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Select Organization"
        description="Pick one organization to work with"
        actions={
          <Button asChild>
            <Link href={onboardingPath()}>
              <LucidePlus className="w-4 h-4" />
              Create Organization
            </Link>
          </Button>
        }
      />

      <Suspense fallback={<Spinner />}>
        <OrganizationList limitedAccess />
      </Suspense>
    </div>
  );
};

export default SelectActiveOrganizationPage;
