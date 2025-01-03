import { getActiveOrganization } from "@/features/organization/queries/get-active-organization";
import { Products } from "@/features/stripe/components/products";

const PricingPage = async () => {
  const activeOrganization = await getActiveOrganization();

  return <Products organizationId={activeOrganization?.id} />;
};

export default PricingPage;
