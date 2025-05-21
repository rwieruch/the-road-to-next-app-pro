import { AttachmentDeleteButton } from "@/features/attachments/components/attachment-delete-button";
import { AttachmentList } from "@/features/attachments/components/attachment-list";
import { CommentWithMetadata } from "../types";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentItem } from "./comment-item";

type CommentListProps = {
  comments: CommentWithMetadata[];
  onDeleteComment: (id: string) => void;
  onDeleteAttachment?: (id: string) => void;
};

const CommentList = ({
  comments,
  onDeleteComment,
  onDeleteAttachment,
}: CommentListProps) => {
  return (
    <>
      {comments.map((comment) => {
        const commentDeleteButton = (
          <CommentDeleteButton
            key="0"
            id={comment.id}
            onDeleteComment={onDeleteComment}
          />
        );

        const buttons = [...(comment.isOwner ? [commentDeleteButton] : [])];

        const sections = [];

        if (comment.attachments.length) {
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
