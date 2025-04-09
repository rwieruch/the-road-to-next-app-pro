"use server";

import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";

const passwordForgotSchema = z.object({
  email: z.string().min(1, { message: "Is required" }).max(191).email(),
});

export const passwordForgot = async (
  _actionState: ActionState,
  formData: FormData
) => {
  try {
    const { email } = passwordForgotSchema.parse({
      email: formData.get("email"),
    });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return toActionState("SUCCESS", "Check your email for a reset link");
    }

    await inngest.send({
      name: "app/password.password-reset",
      data: {
        userId: user.id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Check your email for a reset link");
};
