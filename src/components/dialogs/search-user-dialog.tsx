import { Link } from "@tanstack/react-router";
import { SearchIcon, X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../ui/input-group";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "../ui/item";

type Props = {
	children: ReactNode;
};

export function SearchDialog({ children }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="ring-2 ring-muted sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Search User</DialogTitle>
					<DialogDescription>Find any users here</DialogDescription>
				</DialogHeader>
				<InputGroup>
					<InputGroupInput placeholder="Search..." />
					<InputGroupAddon>
						<SearchIcon />
					</InputGroupAddon>
					<InputGroupAddon
						onClick={() => {
							console.log("remove");
						}}
						align="inline-end"
					>
						<X />
					</InputGroupAddon>
				</InputGroup>
				{/* <SearchResult /> */}
				<SearchHistory />
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

const SearchResult = () => {
	return (
		<div className="space-y-1">
			<div className="flex items-center justify-between">
				<h1 className="text-xs font-medium text-muted-foreground">
					Search result
				</h1>
			</div>
			<div className="flex flex-col gap-y-2">
				<User />
				<User />
				<User />
				<User />
				<User />
			</div>
		</div>
	);
};

const SearchHistory = () => {
	return (
		<div className="space-y-1">
			<div className="flex items-center justify-between">
				<h1 className="text-xs font-medium text-muted-foreground">Recent</h1>
				<button type="button" className="text-xs font-medium text-destructive">
					Clear all
				</button>
			</div>
			<div className="flex flex-col gap-y-2">
				<User />
				<User />
				<User />
				<User />
				<User />
			</div>
		</div>
	);
};

const User = () => {
	return (
		<Item size="xs" className="w-full" asChild>
			<Link to="/$username" params={{ username: "arridha08" }}>
				<ItemMedia>
					<Avatar>
						{/* <AvatarImage src={person.avatar} className="grayscale" /> */}
						<AvatarFallback>A</AvatarFallback>
					</Avatar>
				</ItemMedia>
				<ItemContent className="">
					<ItemTitle>arridha08</ItemTitle>
					<ItemDescription className="leading-none">
						arridhaamrad@gmail.com
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							alert("follow");
						}}
						size={"xs"}
					>
						Follow
					</Button>
				</ItemActions>
			</Link>
		</Item>
	);
};
