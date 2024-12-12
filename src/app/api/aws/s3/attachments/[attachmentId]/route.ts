import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest } from "next/server";
import * as attachmentData from "@/features/attachment/data";
import * as attachmentSubjectDTO from "@/features/attachment/dto/attachment-subject-dto";
import { generateS3Key } from "@/features/attachment/utils/generate-s3-key";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { s3 } from "@/lib/aws";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attachmentId: string }> }
) {
  const { user } = await getAuthOrRedirect();

  const { attachmentId } = await params;

  const attachment = await attachmentData.getAttachment(attachmentId);

  let subject;
  switch (attachment?.entity) {
    case "TICKET":
      subject = attachmentSubjectDTO.fromTicket(attachment.ticket, user.id);
      break;
    case "COMMENT":
      subject = attachmentSubjectDTO.fromComment(attachment.comment, user.id);
      break;
  }

  if (!subject || !attachment) {
    throw new Error("Not found");
  }

  const presignedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: generateS3Key({
        organizationId: subject.organizationId,
        entityId: subject.entityId,
        entity: subject.entity,
        fileName: attachment.name,
        attachmentId: attachment.id,
      }),
    }),
    { expiresIn: 5 * 60 }
  );

  const response = await fetch(presignedUrl);

  const headers = new Headers();
  headers.append(
    "content-disposition",
    `attachment; filename="${attachment.name}"`
  );

  return new Response(response.body, {
    headers,
  });
}
