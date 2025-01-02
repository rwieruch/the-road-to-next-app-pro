"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { CardCompact } from "@/components/card-compact";
import { PaginatedData } from "@/components/pagination/types";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentWithMetadata } from "../../types";
import { CommentCreateForm } from "../comment-create-form";
import { CommentList } from "../comment-list";
import { usePaginatedComments } from "./use-paginated-comments";

type CommentsProps = {
  ticketId: string;
  paginatedComments: PaginatedData<CommentWithMetadata>;
};

const Comments = ({ ticketId, paginatedComments }: CommentsProps) => {
  const {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onCreateComment,
    onDeleteComment,
    onCreateAttachment,
    onDeleteAttachment,
  } = usePaginatedComments(ticketId, paginatedComments);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  return (
    <>
      <CardCompact
        title="Create Comment"
        description="A new comment will be created"
        content={
          <CommentCreateForm
            ticketId={ticketId}
            onCreateComment={onCreateComment}
          />
        }
      />
      <div className="flex flex-col gap-y-2 ml-8">
        <CommentList
          comments={comments}
          onDeleteComment={onDeleteComment}
          onCreateAttachment={onCreateAttachment}
          onDeleteAttachment={onDeleteAttachment}
        />

        {isFetchingNextPage && (
          <>
            <div className="flex gap-x-2">
              <Skeleton className="h-[82px] w-full" />
              <Skeleton className="h-[40px] w-[40px]" />
            </div>
            <div className="flex gap-x-2">
              <Skeleton className="h-[82px] w-full" />
              <Skeleton className="h-[40px] w-[40px]" />
            </div>
          </>
        )}
      </div>

      <div ref={ref}>
        {!hasNextPage && (
          <p className="text-right text-xs italic">No more comments.</p>
        )}
      </div>
    </>
  );
};

export { Comments };
