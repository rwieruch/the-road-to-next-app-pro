type GenerateKeyArgs = {
  organizationId: string;
  ticketId: string;
  fileName: string;
  attachmentId: string;
};

export const generateS3Key = ({
  organizationId,
  ticketId,
  fileName,
  attachmentId,
}: GenerateKeyArgs) => {
  return `${organizationId}/${ticketId}/${fileName}-${attachmentId}`;
};
