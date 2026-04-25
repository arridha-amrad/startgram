import { queryKeys } from "#/lib/query-keys";
import { fetchFeedPostsServerFn } from "#/server-fn/fetch-feed-posts";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export const useFetchFeedPosts = () => {
  const fetchFeedPosts = useServerFn(fetchFeedPostsServerFn)
  return useQuery({
    queryKey: queryKeys.posts.feed(),
    queryFn: () => fetchFeedPosts(),
    staleTime: 1000 * 60 * 5,
  })
}