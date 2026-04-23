import { Lock, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

const user = {
	username: "diyetisyen.hale",
	name: "Zeynep Hale Kocaoglu",
	email: "m@example.com",
	avatar: "https://github.com/shadcn.png",
};

export default function UsernameHoverCard() {
	return (
		<HoverCard openDelay={500} closeDelay={100}>
			<HoverCardTrigger asChild>
				<span className="truncate font-medium">{user.username}</span>
			</HoverCardTrigger>
			<HoverCardContent className="w-xs rounded-md border" asChild>
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback className="rounded-lg">CN</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-extrabold">{user.username}</p>
							<p className="text-xs text-muted-foreground">{user.name}</p>
						</div>
					</div>
					<div className="flex items-center justify-evenly text-xs">
						<div className="flex flex-col items-center">
							<span className="font-bold">1,234</span>
							<span>posts</span>
						</div>
						<div className="flex flex-col items-center">
							<span className="font-bold">1,234</span>
							<span>followers</span>
						</div>
						<div className="flex flex-col items-center">
							<span className="font-bold">1,234</span>
							<span>following</span>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-0.5">
						{[...Array(3)].map((v) => (
							<div key={v} className="aspect-square bg-muted"></div>
						))}
					</div>

					{/* If account is protected and not following */}
					<div className="flex flex-col items-center gap-y-2">
						<div className="rounded-full border-2 border-muted-foreground p-2">
							<Lock className="size-6 text-muted-foreground" />
						</div>
						<h3 className="text-xs font-bold">The account is private</h3>
						<p className="text-xs text-muted-foreground">
							Follow to see their photos and videos.
						</p>
					</div>

					<div className="flex w-full gap-x-2">
						<Button size={"sm"} className="flex-1" variant={"secondary"}>
							<Send className="size-4" />
							Message
						</Button>
						<Button className="flex-1" size={"sm"}>
							Follow
						</Button>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
