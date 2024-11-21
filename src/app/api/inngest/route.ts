import { serve } from "inngest/next";
import { signUpEvent } from "@/features/auth/events/event-sign-up";
import { passwordResetEvent } from "@/features/password/events/event-password-reset";
import { inngest } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [passwordResetEvent, signUpEvent],
});
