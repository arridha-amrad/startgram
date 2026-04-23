import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "#/components/sidebar";
import { getSession } from "#/lib/auth.functions";
import { queryKeys } from "#/lib/query-keys";

export const Route = createFileRoute("/_main_view")({
	beforeLoad: async ({ context: { queryClient } }) => {
		const session = await getSession();
		queryClient.setQueryData(queryKeys.auth.session(), session);
		return { user: session?.user };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = Route.useRouteContext();
	return (
		<div className="mx-auto flex min-h-svh w-full max-w-300 gap-x-4">
			{user && <Sidebar />}
			<Outlet />
		</div>
	);
}
