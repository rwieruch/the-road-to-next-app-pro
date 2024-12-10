import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import { getComments } from "./queries/get-comments";

type CacheArgs = {
  queryClient: QueryClient;
  queryKey: QueryKey;
};

export const removeAttachmentFromCache = (
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
