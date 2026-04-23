import { Smile } from "lucide-react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { useState } from "react";
import EmojiCollections from "@/components/emoji/emoji-collection";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";

type EmojiProps = {
	disabled: boolean;
	setText: Dispatch<SetStateAction<string>>;
	inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
	cursorPositionRef: RefObject<number>;
};

export default function Emoji({
	cursorPositionRef,
	inputRef,
	setText,
}: EmojiProps) {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon">
					<Smile />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-max p-0 border-none"
				onFocusOutside={(e) => e.preventDefault()}
			>
				<PopoverHeader>
					<PopoverTitle className="sr-only">Emoji</PopoverTitle>
					<PopoverDescription className="sr-only">Emoji</PopoverDescription>
				</PopoverHeader>
				<EmojiCollections
					open={open}
					inputRef={inputRef}
					setText={setText}
					cursorPositionRef={cursorPositionRef}
				/>
			</PopoverContent>
		</Popover>
	);
}
