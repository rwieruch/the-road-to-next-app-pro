import { EventSchemas, Inngest } from "inngest";
import { AttachmentDeleteEventArgs } from "@/features/attachments/events/event-attachment-deleted";
import { EmailVerificationEventArgs } from "@/features/auth/events/event-email-verification";
import { InvitationCreateEventArgs } from "@/features/invitation/events/event-invitation-created";
import { OrganizationCreateEventArgs } from "@/features/organization/events/event-organization-created";
import { PasswordResetEventArgs } from "@/features/password/events/event-password-reset";

type Events = {
  "app/organization.created": OrganizationCreateEventArgs;
  "app/password.password-reset": PasswordResetEventArgs;
  "app/auth.sign-up": EmailVerificationEventArgs;
  "app/invitation.created": InvitationCreateEventArgs;
  "app/attachment.deleted": AttachmentDeleteEventArgs;
};

export const inngest = new Inngest({
  id: "the-road-to-next",
  schemas: new EventSchemas().fromRecord<Events>(),
});
