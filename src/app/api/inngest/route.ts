import { serve } from "inngest/next";
import { emailVerificationEvent } from "@/features/auth/events/event-email-verification";
import { passwordResetEvent } from "@/features/password/events/event-password-reset";
import { inngest } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [passwordResetEvent, emailVerificationEvent],
});
