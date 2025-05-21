"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import * as attachmentSubjectDTO from "@/features/attachments/dto/attachment-subject-dto";
import { filesSchema } from "@/features/attachments/schema/files";
import * as attachmentService from "@/features/attachments/service";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import * as ticketData from "@/features/ticket/data";
import { ticketPath } from "@/paths";
import { findIdsFromText } from "@/utils/find-ids-from-text";
import * as commentData from "../data";

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
      options: {
        includeUser: true,
        includeTicket: true,
      },
    });

    const subject = attachmentSubjectDTO.fromComment(comment);

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
      findIdsFromText("tickets", content)
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
