import { AttachmentEntity } from "@prisma/client";
import { AttachmentSubject, isComment, isTicket } from "../types";

export const getOrganizationIdByAttachment = (
  entity: AttachmentEntity,
  subject: null | AttachmentSubject
) => {
  if (!subject) return "";

  let organizationId = "";
  switch (entity) {
    case "TICKET": {
      if (isTicket(subject)) {
        organizationId = subject.organizationId;
      }
      break;
    }
    case "COMMENT": {
      if (isComment(subject)) {
        organizationId = subject.ticket.organizationId;
      }
      break;
    }
  }

  return organizationId;
};
