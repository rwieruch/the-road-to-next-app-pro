import { EventSchemas, Inngest } from "inngest";
import { EmailVerificationEventArgs } from "@/features/auth/events/event-email-verification";
import { InvitationCreateEventArgs } from "@/features/invitation/events/event-invitation-created";
import { PasswordResetEventArgs } from "@/features/password/events/event-password-reset";

type Events = {
  "app/password.password-reset": PasswordResetEventArgs;
  "app/auth.sign-up": EmailVerificationEventArgs;
  "app/invitation.created": InvitationCreateEventArgs;
};

export const inngest = new Inngest({
  id: "the-road-to-next",
  schemas: new EventSchemas().fromRecord<Events>(),
});
