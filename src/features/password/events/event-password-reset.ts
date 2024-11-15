import { inngest } from "@/lib/inngest";
import { sendEmailPasswordReset } from "../emails/send-email-password-reset";

export const passwordResetEvent = inngest.createFunction(
  { id: "password-reset" },
  { event: "app/password.password-reset" },
  async ({ event }) => {
    const { username, email, passwordResetLink } = event.data;

    const result = await sendEmailPasswordReset(
      username,
      email,
      passwordResetLink
    );

    return { event, body: result };
  }
);
