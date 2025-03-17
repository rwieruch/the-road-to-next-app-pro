"use server";

import { redirect } from "next/navigation";
import { setCookieByKey } from "@/actions/cookies";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { signInPath } from "@/paths";
import { hashToken } from "@/utils/crypto";

export const acceptInvitation = async (tokenId: string) => {
  try {
    const tokenHash = hashToken(tokenId);

    const invitation = await prisma.invitation.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!invitation) {
      return toActionState("ERROR", "Revoked or invalid verification token");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: invitation.email,
      },
    });

    if (user) {
      await prisma.$transaction([
        prisma.invitation.delete({
          where: {
            tokenHash,
          },
        }),
        prisma.membership.create({
          data: {
            organizationId: invitation.organizationId,
            userId: user.id,
            membershipRole: "MEMBER",
            isActive: false,
          },
        }),
      ]);
    } else {
      await prisma.invitation.update({
        where: {
          tokenHash,
        },
        data: {
          status: "ACCEPTED_WITHOUT_ACCOUNT",
        },
      });
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  await setCookieByKey("toast", "Invitation accepted");
  redirect(signInPath());
};
