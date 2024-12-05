import { Attachment } from "@prisma/client";

type AttachmentItemProps = {
  attachment: Attachment;
};

const AttachmentItem = ({ attachment }: AttachmentItemProps) => {
  return <p className="text-sm">{attachment.name}</p>;
};

export { AttachmentItem };
