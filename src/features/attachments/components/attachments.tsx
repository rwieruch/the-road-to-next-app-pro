import { AttachmentEntity } from "@prisma/client";
import { CardCompact } from "@/components/card-compact";
import { getAttachments } from "../queries/get-attachments";
import { AttachmentCreateForm } from "./attachment-create-form";
import { AttachmentDeleteButton } from "./attachment-delete-button";
import { AttachmentList } from "./attachment-list";

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
          <AttachmentList
            attachments={attachments}
            buttons={(attachmentId: string) => [
              ...(isOwner
                ? [<AttachmentDeleteButton key="0" id={attachmentId} />]
                : []),
            ]}
          />

          {isOwner && (
            <AttachmentCreateForm entityId={entityId} entity={entity} />
          )}
        </>
      }
    />
  );
};

export { Attachments };
