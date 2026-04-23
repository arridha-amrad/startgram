import { createFileRoute } from "@tanstack/react-router";
import ProfileEmptyPosts from "@/components/profile-empty-posts";

export const Route = createFileRoute("/_main_view/$username/tagged")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<ProfileEmptyPosts title="Photos of you" />
		</div>
	);
}
