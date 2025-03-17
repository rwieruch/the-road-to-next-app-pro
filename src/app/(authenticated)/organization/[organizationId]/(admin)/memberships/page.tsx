import { Suspense } from "react";
import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { InvitationCreateButton } from "@/features/invitation/components/invitation-create-button";
import { MembershipList } from "@/features/membership/components/membership-list";
import { OrganizationBreadcrumbs } from "../_navigation/tabs";

type MembershipsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const MembershipsPage = async ({ params }: MembershipsPageProps) => {
  const { organizationId } = await params;

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Memberships"
        description="Manage members in your organization"
        tabs={<OrganizationBreadcrumbs />}
        actions={<InvitationCreateButton organizationId={organizationId} />}
      />

      <Suspense fallback={<Spinner />}>
        <MembershipList organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default MembershipsPage;
