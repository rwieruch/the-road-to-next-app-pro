import * as attachmentData from "../data";
import * as attachmentSubjectDTO from "../dto/attachment-subject-dto";

export const getAttachmentWithSubject = async (
  attachmentId: string,
  userId: string
) => {
  const attachment = await attachmentData.getAttachment(attachmentId);

  let subject;
  switch (attachment?.entity) {
    case "TICKET":
      subject = attachmentSubjectDTO.fromTicket(attachment.ticket, userId);
      break;
    case "COMMENT":
      subject = attachmentSubjectDTO.fromComment(attachment.comment, userId);
      break;
  }

  return { attachment, subject };
};
