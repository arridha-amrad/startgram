import { createFileRoute } from "@tanstack/react-router";
import ProfileEmptyPosts from "@/components/profile-empty-posts";

export const Route = createFileRoute("/_main_view/$username/saved")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ProfileEmptyPosts title="Start Saving" />;
}
