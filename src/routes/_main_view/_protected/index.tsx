import { createFileRoute } from "@tanstack/react-router";
import { VolumeProvider } from "#/components/contexts/volume-context";
import FeedPost from "#/components/feed-post";
import SuggestedUsers from "#/components/suggested-users";
import VideoPostItem from "#/components/video-post-item";

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
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<VolumeProvider>
			<div className="flex-1 space-y-4 border border-orange-500 p-4">
				<FeedPost />
				<VideoPostItem />
				<VideoPostItem />
				<FeedPost />
				<FeedPost />
			</div>
			<div className="sticky top-0 hidden h-svh w-xs border border-lime-500 p-4 lg:block">
				<SuggestedUsers />
			</div>
		</VolumeProvider>
	);
}
