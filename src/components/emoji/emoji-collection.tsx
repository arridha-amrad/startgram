import type { EmojiClickData } from "emoji-picker-react";
import { EmojiStyle, SuggestionMode, Theme } from "emoji-picker-react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { lazy, Suspense } from "react";

const AppEmojiPicker = lazy(() => import("emoji-picker-react"));

export type TEmojiProps = {
	setText: Dispatch<SetStateAction<string>>;
	inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
	cursorPositionRef: RefObject<number>;
};

type Props = {
	open: boolean;
} & TEmojiProps;

export default function EmojiCollections({
	inputRef,
	open,
	setText,
	cursorPositionRef,
}: Props) {
	const handleEmojiClick = (emojiData: EmojiClickData) => {
		if (inputRef.current === null) return;
		const pos = cursorPositionRef.current;
		const ref = inputRef.current;

		setText((prev) => {
			const start = prev.slice(0, pos);
			const end = prev.slice(pos);
			const newText = start + emojiData.emoji + end;
			return newText;
		});

		const newCursorPos = pos + emojiData.emoji.length;
		cursorPositionRef.current = newCursorPos;

		setTimeout(() => {
			ref.focus();
			ref.setSelectionRange(newCursorPos, newCursorPos);
		}, 0);
	};

	return (
		<div className="size-max shrink-0" onWheel={(e) => e.stopPropagation()}>
			<Suspense
				fallback={
					<div className="h-[450px] w-[350px] bg-popover animate-pulse rounded-lg" />
				}
			>
				<AppEmojiPicker
					suggestedEmojisMode={SuggestionMode.RECENT}
					previewConfig={{ showPreview: false }}
					theme={Theme.DARK}
					onEmojiClick={handleEmojiClick}
					open={open}
					className="custom-scrollbar"
					emojiStyle={EmojiStyle.NATIVE}
					lazyLoadEmojis={true}
				/>
			</Suspense>
		</div>
	);
}
