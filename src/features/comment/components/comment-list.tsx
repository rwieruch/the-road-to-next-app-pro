import { AttachmentCreateButton } from "@/features/attachment/components/attachment-create-button";
import { CommentWithMetadata } from "../types";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentItem } from "./comment-item";

type CommentListProps = {
  comments: CommentWithMetadata[];
  onDeleteComment: (id: string) => void;
};

const CommentList = ({ comments, onDeleteComment }: CommentListProps) => {
  return (
    <>
      {comments.map((comment) => {
        const attachmentCreateButton = (
          <AttachmentCreateButton
            key="0"
            entityId={comment.id}
            entity="COMMENT"
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

        return (
          <CommentItem key={comment.id} comment={comment} buttons={buttons} />
        );
      })}
    </>
  );
};

export { CommentList };
