"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { AttachmentSubjectDTO } from "@/features/attachment/dto/attachment-subject-dto";
import { filesSchema } from "@/features/attachment/schema/files";
import * as attachmentService from "@/features/attachment/service";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import * as commentData from "@/features/comment/data";
import * as ticketData from "@/features/ticket/data";
import { ticketPath } from "@/paths";
import { findTicketIdsFromText } from "@/utils/find-ids-from-text";

const createCommentSchema = z.object({
  content: z.string().min(1).max(1024),
  files: filesSchema,
});

export const createComment = async (
  ticketId: string,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  let comment;

  try {
    const { content, files } = createCommentSchema.parse({
      content: formData.get("content"),
      files: formData.getAll("files"),
    });

    comment = await commentData.createComment({
      userId: user.id,
      ticketId,
      content,
    });

    const subject = AttachmentSubjectDTO.fromComment(comment, user.id);

    if (!subject) {
      return toActionState("ERROR", "Comment not created");
    }

    await attachmentService.createAttachments({
      subject: subject,
      entity: "COMMENT",
      entityId: comment.id,
      files,
    });

    await ticketData.connectReferencedTickets(
      ticketId,
      findTicketIdsFromText("tickets", content)
    );
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(ticketId));

  return toActionState("SUCCESS", "Comment created", undefined, {
    ...comment,
    isOwner: true,
  });
};
