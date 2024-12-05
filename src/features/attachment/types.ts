import { Prisma } from "@prisma/client";

type AttachmentSubjectTicket = Prisma.TicketGetPayload<{
  select: {
    id: true;
    organizationId: true;
  };
}>;

type AttachmentSubjectComment = Prisma.CommentGetPayload<{
  include: {
    ticket: {
      id: true;
      select: {
        id: true;
        organizationId: true;
      };
    };
  };
}>;

export type AttachmentSubject =
  | AttachmentSubjectTicket
  | AttachmentSubjectComment;

export const isTicket = (
  subject: AttachmentSubject
): subject is AttachmentSubjectTicket => {
  return "organizationId" in subject;
};

export const isComment = (
  subject: AttachmentSubject
): subject is AttachmentSubjectComment => {
  return "ticket" in subject;
};
