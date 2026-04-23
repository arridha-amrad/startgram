import { ChevronDown } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { useCreatePost } from "./create-post-context";

export default function Accessibility() {
	const { mediaWithTaggedUsers } = useCreatePost();

	return (
		<Collapsible className="pr-2">
			<CollapsibleTrigger className="group flex w-full items-center justify-between py-2 text-sm">
				<span className="font-light transition-all group-data-[state=open]:font-medium">
					Accessibility
				</span>
				<ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
			</CollapsibleTrigger>
			<CollapsibleContent className="space-y-4 pt-2 pb-4">
				<p className="text-xs text-muted-foreground">
					Alt text describes your photos for people with visual impairments. Alt
					text will be automatically created for your photos or you can choose
					to write your own.
				</p>
				<div className="space-y-3">
					{mediaWithTaggedUsers.map((media) => (
						<div key={media.src} className="flex w-full items-center gap-4">
							<div className="relative size-11 shrink-0 overflow-hidden rounded-sm border">
								{media.type === "image" && (
									<img
										src={media.src}
										alt="preview"
										className="h-full w-full object-cover"
									/>
								)}
								{media.type === "video" && (
									<video
										src={media.src}
										muted
										className="h-full w-full object-cover"
									/>
								)}
							</div>
							<Input
								type="text"
								className="h-9 text-xs"
								placeholder="Write alt text..."
							/>
						</div>
					))}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
