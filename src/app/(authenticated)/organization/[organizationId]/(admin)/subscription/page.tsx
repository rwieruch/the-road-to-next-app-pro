import { Heading } from "@/components/heading";
import { OrganizationBreadcrumbs } from "../_navigation/tabs";

type SubscriptionPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const SubscriptionPage = async ({ params }: SubscriptionPageProps) => {
  const { organizationId } = await params;

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Subscription"
        description="Manage your subscription"
        tabs={<OrganizationBreadcrumbs />}
      />
    </div>
  );
};

export default SubscriptionPage;
