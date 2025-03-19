import { Attachment } from "@prisma/client";

type AttachmentItemProps = {
  attachment: Attachment;
  buttons: React.ReactNode[];
};

const AttachmentItem = ({ attachment, buttons }: AttachmentItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm truncate">{attachment.name}</p>
      {buttons}
    </div>
  );
};

export { AttachmentItem };
