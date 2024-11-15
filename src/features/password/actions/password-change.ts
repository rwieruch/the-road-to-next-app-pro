"use server";

import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { generatePasswordResetLink } from "../../password/utils/generate-password-reset-link";
import { verifyPasswordHash } from "../utils/hash-and-verify";

const passwordChangeSchema = z.object({
  password: z.string().min(6).max(191),
});

export const passwordChange = async (
  _actionState: ActionState,
  formData: FormData
) => {
  const auth = await getAuthOrRedirect();

  try {
    const { password } = passwordChangeSchema.parse({
      password: formData.get("password"),
    });

    const user = await prisma.user.findUnique({
      where: { email: auth.user.email },
    });

    if (!user) {
      // we should never reach this return statement
      // but it's here just in case
      return toActionState("ERROR", "Invalid request", formData);
    }

    const validPassword = await verifyPasswordHash(user.passwordHash, password);

    if (!validPassword) {
      return toActionState("ERROR", "Incorrect password", formData);
    }

    const passwordResetLink = await generatePasswordResetLink(user.id);

    // TODO: Send email with reset link
    // instead we will just print it to the console for now
    console.log(passwordResetLink);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Check your email for a reset link");
};
