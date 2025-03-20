import { Attachment } from "@prisma/client";
import { AttachmentItem } from "./attachment-item";

type AttachmentListProps = {
  attachments: Attachment[];
  buttons: (id: string) => React.ReactNode[];
};

const AttachmentList = ({ attachments, buttons }: AttachmentListProps) => {
  return (
    <div className="mx-2 flex flex-col gap-y-2 mb-4">
      {attachments.map((attachment) => (
        <AttachmentItem
          key={attachment.id}
          attachment={attachment}
          buttons={buttons(attachment.id)}
        />
      ))}
    </div>
  );
};

export { AttachmentList };
