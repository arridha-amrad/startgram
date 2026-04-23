import { ChevronDown } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import Avatar from "../avatar";

export default function ShareTo() {
	return (
		<Collapsible className="pr-2">
			<CollapsibleTrigger className="group flex w-full items-center justify-between py-2 text-sm">
				<span className="font-light transition-all group-data-[state=open]:font-medium">
					Share To
				</span>
				<ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
			</CollapsibleTrigger>
			<CollapsibleContent className="space-y-4 pt-2 pb-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex flex-1 items-center gap-3">
						<Avatar />
						<div className="flex flex-col">
							<span className="text-sm font-medium">arridha08</span>
							<span className="text-xs text-muted-foreground">
								Threads · Public
							</span>
						</div>
					</div>
					<Switch id="share-to-threads" />
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
