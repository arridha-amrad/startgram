import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "#/lib/auth.functions";
import { queryKeys } from "#/lib/query-keys";

export const Route = createFileRoute("/_main_view/_protected")({
	component: RouteComponent,
	beforeLoad: async ({ context: { queryClient } }) => {
		const session = await getSession();
		if (!session) {
			throw redirect({ to: "/auth/login" });
		}
		queryClient.setQueryData(queryKeys.auth.session(), session);
	},
});

function RouteComponent() {
	return <Outlet />;
}
