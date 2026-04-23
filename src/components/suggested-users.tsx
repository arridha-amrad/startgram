import HomeFooter from "./footers/home-footer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import UsernameHoverCard from "./username-hover-card";

const user = {
	name: "shadcn",
	email: "m@example.com",
	avatar: "https://github.com/shadcn.png",
};

export default function SuggestedUsers() {
	return (
		<div className="w-full space-y-6">
			<div className="px-1">
				<h5 className="text-sm font-semibold text-muted-foreground">
					Suggested users
				</h5>
			</div>

			<div className="space-y-2">
				{[...Array(5)].map((_, i) => (
					<div
						key={i}
						className="flex items-center gap-2 rounded-md px-1 py-1.5 text-left text-sm"
					>
						<Avatar className="lg:size-10">
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback className="rounded-lg">CN</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 space-y-1 text-left text-sm">
							<UsernameHoverCard />
							<span className="truncate text-xs text-muted-foreground">
								Recommended for you
							</span>
						</div>
						<Button variant={"ghost"} color="primary" size={"xs"}>
							Follow
						</Button>
					</div>
				))}
			</div>
			<HomeFooter />
		</div>
	);
}
