import { useLocation, useNavigate } from "@tanstack/react-router";
import { BookmarkIcon, Grid, SquareUser, Video } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProfileTabs() {
	const pathname = useLocation().pathname;
	const defaultValue = pathname.split("/").slice(2)[0];

	const navigate = useNavigate();
	const links = [
		{
			title: "Posts",
			value: "",
			icon: Grid,
		},
		{
			title: "Reels",
			value: "reels",
			icon: Video,
		},
		{
			title: "Saved",
			value: "saved",
			icon: BookmarkIcon,
		},
		{
			title: "Tagged",
			value: "tagged",
			icon: SquareUser,
		},
	];
	return (
		<Tabs
			onValueChange={(e) => {
				navigate({ to: `/$username/${e}`, params: { username: "arridha08" } });
			}}
			defaultValue={defaultValue}
		>
			<TabsList>
				{links.map((item) => (
					<TabsTrigger value={item.value} key={item.title}>
						<item.icon />
						{item.title}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}
