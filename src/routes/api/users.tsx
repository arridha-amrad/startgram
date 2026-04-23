import { createFileRoute } from "@tanstack/react-router";
import type { UserMinimal } from "@/types/user.types";

export const Route = createFileRoute("/api/users")({
	server: {
		handlers: {
			GET: () => {
				const data: Array<UserMinimal> = [
					{
						id: "1",
						username: "ari",
						name: "Arianur",
						image: "https://github.com/shadcn.png",
					},
					{
						id: "2",
						username: "hale",
						name: "Hale Koc",
						image: "https://github.com/shadcn.png",
					},
					{
						id: "3",
						username: "zeynep",
						name: "Zeynep Hale asd dsadsad ",
						image: "https://github.com/shadcn.png",
					},
				];
				return new Response(JSON.stringify({ users: data }));
			},
		},
	},
});
