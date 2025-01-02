import {
  InfiniteData,
  QueryClient,
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PaginatedData } from "@/components/pagination/types";
import { getComments } from "../../queries/get-comments";
import { CommentWithMetadata } from "../../types";

type CacheArgs = {
  queryClient: QueryClient;
  queryKey: QueryKey;
};

const removeAttachmentFromCache = (
  { queryClient, queryKey }: CacheArgs,
  payload: { attachmentId: string; commentId: string }
) => {
  queryClient.setQueryData<
    InfiniteData<Awaited<ReturnType<typeof getComments>>>
  >(queryKey, (cache) => {
    if (!cache) return cache;

    const pages = cache.pages.map((page) => ({
      ...page,
      list: page.list.map((comment) => {
        if (comment.id === payload.commentId) {
          return {
            ...comment,
            attachments: comment.attachments.filter(
              (attachment) => attachment.id !== payload.attachmentId
            ),
          };
        }

        return comment;
      }),
    }));

    return { ...cache, pages };
  });
};

export const usePaginatedComments = (
  ticketId: string,
  paginatedComments: PaginatedData<CommentWithMetadata>
) => {
  const queryKey = ["comments", ticketId];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => getComments(ticketId, pageParam),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
      initialData: {
        pages: [
          {
            list: paginatedComments.list,
            metadata: paginatedComments.metadata,
          },
        ],
        pageParams: [undefined],
      },
    });

  const comments = data.pages.flatMap((page) => page.list);

  const queryClient = useQueryClient();

  const handleDeleteAttachment = (commentId: string, attachmentId: string) => {
    removeAttachmentFromCache(
      { queryClient, queryKey },
      { attachmentId, commentId }
    );

    queryClient.invalidateQueries({ queryKey });
  };

  return {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onCreateComment: () => queryClient.invalidateQueries({ queryKey }),
    onDeleteComment: () => queryClient.invalidateQueries({ queryKey }),
    onCreateAttachment: () => queryClient.invalidateQueries({ queryKey }),
    onDeleteAttachment: handleDeleteAttachment,
  };
};
