import { Link } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
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
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const options = [
	{
		title: "Report",
		isDestructive: true,
	},
	{
		title: "Unfollow",
		isDestructive: true,
	},
	{
		title: "Add to favorites",
		isDestructive: false,
	},
	{
		title: "Go to post",
		isDestructive: false,
	},
	{
		title: "Copy link",
		isDestructive: false,
	},
	{
		title: "About this account",
		isDestructive: false,
	},
];

export default function FeedPostOptions() {
	return (
		<Dialog>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<MoreHorizontal className="h-5 w-5" />
						</Button>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					<p>More Options</p>
				</TooltipContent>
			</Tooltip>
			<DialogContent showCloseButton={false} className="sm:max-w-sm">
				<DialogHeader className="sr-only">
					<DialogTitle>Options</DialogTitle>
					<DialogDescription>More Options</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col">
					{options.map((item, i) => (
						<Fragment key={item.title}>
							<Link
								className={cn(
									"py-3 text-center",
									item.isDestructive ? "font-medium text-destructive" : "",
								)}
								to="/"
							>
								{item.title}
							</Link>
							{i !== options.length - 1 && (
								<Separator orientation="horizontal" />
							)}
						</Fragment>
					))}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
