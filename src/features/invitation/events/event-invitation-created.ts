import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { sendEmailInvitation } from "../emails/send-email-invitation";

export type InvitationCreateEventArgs = {
  data: {
    userId: string;
    organizationId: string;
    email: string;
    emailInvitationLink: string;
  };
};

export const invitationCreatedEvent = inngest.createFunction(
  { id: "invitation-created" },
  { event: "app/invitation.created" },
  async ({ event }) => {
    const { userId, organizationId, email, emailInvitationLink } = event.data;

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    const organization = await prisma.organization.findUniqueOrThrow({
      where: {
        id: organizationId,
      },
    });

    const result = await sendEmailInvitation(
      user.username,
      organization.name,
      email,
      emailInvitationLink
    );

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message}`);
    }

    return { event, body: true };
  }
);
