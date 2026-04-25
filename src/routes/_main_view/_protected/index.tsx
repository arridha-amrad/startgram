import { createFileRoute } from "@tanstack/react-router";
import { VolumeProvider } from "#/components/contexts/volume-context";
import FeedPost from "#/components/feed-post";
import SuggestedUsers from "#/components/suggested-users";
import VideoPostItem from "#/components/video-post-item";
import { fetchFeedPostsServerFn } from "#/server-fn/fetch-feed-posts";
import { queryKeys } from "#/lib/query-keys";
import { useFetchFeedPosts } from "#/hooks/queries/use-fetch-post";

export const Route = createFileRoute("/_main_view/_protected/")({
  head() {
    return {
      meta: [
        {
          title: "Startgram | Home",
        },
      ],
    };
  },
  loader: async ({ context }) => {
    const feedPosts = await fetchFeedPostsServerFn();
    context.queryClient.setQueryData(queryKeys.posts.feed(), feedPosts);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: feedPosts } = useFetchFeedPosts();
  return (
    <VolumeProvider>
      <div className="flex-1 space-y-4 border border-orange-500 p-4">
        {feedPosts?.map((post) => (
          <FeedPost key={post.id} feedPost={post} />
        ))}
        {/* <VideoPostItem />
    		<VideoPostItem />
    		<FeedPost />
    		<FeedPost /> */}
      </div>
      <div className="sticky top-0 hidden h-svh w-xs border border-lime-500 p-4 lg:block">
        <SuggestedUsers />
      </div>
    </VolumeProvider>
  );
}
