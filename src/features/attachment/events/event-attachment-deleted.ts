import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { generateS3Key } from "../utils/generate-s3-key";

export type AttachmentDeleteEventArgs = {
  data: {
    attachmentId: string;
  };
};

export const attachmentDeletedEvent = inngest.createFunction(
  { id: "attachment-deleted" },
  { event: "app/attachment.deleted" },
  async ({ event }) => {
    const { attachmentId } = event.data;

    try {
      const attachment = await prisma.attachment.findUniqueOrThrow({
        where: {
          id: attachmentId,
        },
        include: {
          ticket: true,
        },
      });

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: generateS3Key({
            organizationId: attachment.ticket.organizationId,
            ticketId: attachment.ticket.id,
            fileName: attachment.name,
            attachmentId: attachment.id,
          }),
        })
      );
    } catch (error) {
      console.log(error);
      return { event, body: false };
    }

    return { event, body: true };
  }
);
