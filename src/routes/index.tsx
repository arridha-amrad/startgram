import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as m from "@/paraglide/messages";
import toast from "react-hot-toast";
import { Button } from "#/components/ui/button";
import { getSession } from "#/lib/auth.functions";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/")({
	component: App,
	loader: async () => {
		const session = await getSession().catch(() => null);
		return {
			user: session?.user,
		};
	},
});

function App() {
	const { user } = Route.useLoaderData();
	const navigate = useNavigate();
	const logout = async () => {
		const res = await authClient.signOut();
		if (res.error) {
			if (res.error.message) {
				toast.error(res.error.message);
			}
		} else {
			navigate({ to: "/auth/login" });
		}
	};
	return (
		<div>
			<h1>{user?.name}</h1>
			<Button onClick={logout}>{m.common_logout()}</Button>
		</div>
	);
}
