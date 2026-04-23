import { Check, Ratio, RectangleVertical, Square } from "lucide-react";
import { Button } from "../ui/button";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "../ui/popover";
import { useCreatePost } from "./create-post-context";

export default function RatioPopover() {
	const { aspectRatio, setAspectRatio } = useCreatePost();
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="secondary" size={"icon-sm"}>
					<Ratio />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				align="start"
				className="w-max bg-black/70 backdrop-blur"
			>
				<PopoverHeader>
					<PopoverTitle>Ratio</PopoverTitle>
					<PopoverDescription>
						Pick the ratio of your content
					</PopoverDescription>
				</PopoverHeader>
				<div className="flex flex-col gap-2">
					<button
						type="button"
						className="relative flex items-center justify-end gap-2 rounded-md border border-foreground/10 px-2 py-1.5 pr-2 pl-6 text-foreground hover:bg-foreground/10"
						onClick={() => setAspectRatio("1 / 1")}
					>
						<span className="absolute top-1/2 left-2 -translate-y-1/2">
							{aspectRatio === "1 / 1" && <Check className="size-4" />}
						</span>
						1:1
						<Square />
					</button>
					<button
						type="button"
						className="relative flex items-center justify-end gap-2 rounded-md border border-foreground/10 py-1.5 pr-2 pl-6 text-foreground/50 hover:bg-foreground/10"
						onClick={() => setAspectRatio("4 / 5")}
					>
						<span className="absolute top-1/2 left-2 -translate-y-1/2">
							{aspectRatio === "4 / 5" && <Check className="size-4" />}
						</span>
						4:5
						<RectangleVertical />
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
