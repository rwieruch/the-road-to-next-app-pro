import { AttachmentCreateButton } from "@/features/attachment/components/attachment-create-button";
import { AttachmentDeleteButton } from "@/features/attachment/components/attachment-delete-button";
import { AttachmentList } from "@/features/attachment/components/attachment-list";
import { CommentWithMetadata } from "../types";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentItem } from "./comment-item";

type CommentListProps = {
  comments: CommentWithMetadata[];
  onDeleteComment: (id: string) => void;
  onCreateAttachment?: () => void;
  onDeleteAttachment?: (id: string) => void;
};

const CommentList = ({
  comments,
  onDeleteComment,
  onCreateAttachment,
  onDeleteAttachment,
}: CommentListProps) => {
  return (
    <>
      {comments.map((comment) => {
        const attachmentCreateButton = (
          <AttachmentCreateButton
            key="0"
            entityId={comment.id}
            entity="COMMENT"
            onCreateAttachment={onCreateAttachment}
          />
        );

        const commentDeleteButton = (
          <CommentDeleteButton
            key="1"
            id={comment.id}
            onDeleteComment={onDeleteComment}
          />
        );

        const buttons = [
          ...(comment.isOwner
            ? [attachmentCreateButton, commentDeleteButton]
            : []),
        ];

        const sections = [];

        if (comment.attachments?.length) {
          sections.push({
            label: "Attachments",
            content: (
              <AttachmentList
                attachments={comment.attachments}
                buttons={(attachmentId) => [
                  ...(comment.isOwner
                    ? [
                        <AttachmentDeleteButton
                          key="0"
                          id={attachmentId}
                          onDeleteAttachment={onDeleteAttachment}
                        />,
                      ]
                    : []),
                ]}
              />
            ),
          });
        }

        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            sections={sections}
            buttons={buttons}
          />
        );
      })}
    </>
  );
};

export { CommentList };
