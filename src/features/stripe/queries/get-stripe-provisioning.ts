import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const getStripeProvisioningByOrganization = async (
  organizationId: string | null | undefined
) => {
  if (!organizationId) {
    return {
      allowedMembers: 0,
      currentMembers: 0,
    };
  }

  const [membershipCount, invitationCount, stripeCustomer] =
    await prisma.$transaction([
      prisma.membership.count({
        where: {
          organizationId,
        },
      }),
      prisma.invitation.count({
        where: {
          organizationId,
        },
      }),
      prisma.stripeCustomer.findUnique({
        where: {
          organizationId,
        },
      }),
    ]);

  const currentMembers = membershipCount + invitationCount;
  const isActive = stripeCustomer?.subscriptionStatus === "active";

  if (!isActive || !stripeCustomer?.productId) {
    return {
      allowedMembers: 1,
      currentMembers,
    };
  }

  const product = await stripe.products.retrieve(stripeCustomer.productId);

  return {
    allowedMembers: Number(product.metadata.allowedMembers),
    currentMembers,
  };
};
