import { EventSchemas, Inngest } from "inngest";
import { SignUpEventArgs } from "@/features/auth/events/event-sign-up";
import { PasswordResetEventArgs } from "@/features/password/events/event-password-reset";

type Events = {
  "app/password.password-reset": PasswordResetEventArgs;
  "app/auth.sign-up": SignUpEventArgs;
};

export const inngest = new Inngest({
  id: "the-road-to-next",
  schemas: new EventSchemas().fromRecord<Events>(),
});
