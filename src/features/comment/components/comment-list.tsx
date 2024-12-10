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
        const commentDeleteButton = (
          <CommentDeleteButton
            key="0"
            id={comment.id}
            onDeleteComment={onDeleteComment}
          />
        );

        const buttons = [...(comment.isOwner ? [commentDeleteButton] : [])];

        return (
          <CommentItem key={comment.id} comment={comment} buttons={buttons} />
        );
      })}
    </>
  );
};

export { CommentList };
