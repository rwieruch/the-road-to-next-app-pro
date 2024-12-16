import { Heading } from "@/components/heading";
import { CredentialCreateButton } from "@/features/credential/components/credential-create-button";
import { OrganizationBreadcrumbs } from "../_navigation/tabs";

type CredentialsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const CredentialsPage = async ({ params }: CredentialsPageProps) => {
  const { organizationId } = await params;

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Credentials"
        description="Manage your organization's API secrets"
        tabs={<OrganizationBreadcrumbs />}
        actions={<CredentialCreateButton organizationId={organizationId} />}
      />
    </div>
  );
};

export default CredentialsPage;
