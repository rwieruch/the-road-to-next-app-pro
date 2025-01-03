import { prisma } from "@/lib/prisma";

export const getStripeCustomerByOrganization = async (
  organizationId: string | null | undefined
) => {
  if (!organizationId) {
    return null;
  }

  return prisma.stripeCustomer.findUnique({
    where: {
      organizationId,
    },
  });
};
