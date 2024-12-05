import { AttachmentEntity } from "@prisma/client";
import { CardCompact } from "@/components/card-compact";
import { getAttachments } from "../queries/get-attachments";
// import { AttachmentCreateForm } from "./attachment-create-form";
import { AttachmentDeleteButton } from "./attachment-delete-button";
import { AttachmentItem } from "./attachment-item";

type AttachmentsProps = {
  entityId: string;
  entity: AttachmentEntity;
  isOwner: boolean;
};

const Attachments = async ({ entityId, entity, isOwner }: AttachmentsProps) => {
  const attachments = await getAttachments(entityId, entity);

  return (
    <CardCompact
      title="Attachments"
      description="Attached images or PDFs"
      content={
        <>
          <div className="mx-2 flex flex-col gap-y-2 mb-4">
            {attachments.map((attachment) => (
              <AttachmentItem
                key={attachment.id}
                attachment={attachment}
                buttons={[
                  ...(isOwner
                    ? [<AttachmentDeleteButton key="0" id={attachment.id} />]
                    : []),
                ]}
              />
            ))}
          </div>

          {/* {isOwner && <AttachmentCreateForm ticketId={ticketId} />} */}
        </>
      }
    />
  );
};

export { Attachments };
