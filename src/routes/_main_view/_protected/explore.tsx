import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main_view/_protected/explore")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/explore"!</div>;
}
