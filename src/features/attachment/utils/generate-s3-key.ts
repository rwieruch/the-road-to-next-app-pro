import { AttachmentEntity } from "@prisma/client";

type GenerateKeyArgs = {
  organizationId: string;
  entityId: string;
  entity: AttachmentEntity;
  fileName: string;
  attachmentId: string;
};

export const generateS3Key = ({
  organizationId,
  entityId,
  entity,
  fileName,
  attachmentId,
}: GenerateKeyArgs) => {
  return `${organizationId}/${entity}/${entityId}/${fileName}-${attachmentId}`;
};
