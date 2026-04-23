import { useId, useRef } from "react";
import {
	type Control,
	type FieldValues,
	type Path,
	type PathValue,
	type UseFormGetValues,
	type UseFormRegister,
	type UseFormSetValue,
	useWatch,
} from "react-hook-form";
import { cn } from "#/lib/utils";
import { MAX_CAPTION_LENGTH } from "#/zod-schemas/createpost-schema";
import Emoji from "../../emoji/emoji-btn";
import { Field, FieldLabel } from "../../ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupText,
	InputGroupTextarea,
} from "../../ui/input-group";

type CaptionTextareaProps<T extends FieldValues> = {
	getValues: UseFormGetValues<T>;
	name: Path<T>;
	setValue: UseFormSetValue<T>;
	register: UseFormRegister<T>;
	control: Control<T>;
};

export default function CaptionTextarea<T extends FieldValues>({
	getValues,
	name,
	setValue,
	register,
	control,
}: CaptionTextareaProps<T>) {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const cursorPositionRef = useRef<number>(0);

	const watchedValue = useWatch({ control, name: name }) || "";

	const handleCursorPosition = (
		e: React.SyntheticEvent<HTMLTextAreaElement>,
	) => {
		const position = e.currentTarget.selectionStart;
		cursorPositionRef.current = position;
	};

	const { ref: registerRef, ...registerRest } = register(name);
	const id = useId();
	return (
		<Field>
			<FieldLabel htmlFor={id}>Caption</FieldLabel>
			<InputGroup>
				<InputGroupTextarea
					id={id}
					{...registerRest}
					ref={(e) => {
						registerRef(e);
						textAreaRef.current = e;
					}}
					onClick={handleCursorPosition}
					onKeyUp={handleCursorPosition}
					onInput={handleCursorPosition}
					placeholder="Write your caption..."
					className="min-h-24 text-base"
				/>
				<InputGroupAddon
					align="block-end"
					className="p-0 flex items-center justify-between"
				>
					<InputGroupButton
						size="icon-sm"
						className="mr-auto"
						variant="ghost"
						asChild
					>
						<Emoji
							disabled={false}
							cursorPositionRef={cursorPositionRef}
							inputRef={textAreaRef}
							setText={(val: string | ((prev: string) => string)) => {
								const currentVal = getValues(name) || "";
								const newValue =
									typeof val === "function" ? val(currentVal) : val;
								setValue(name, newValue as PathValue<T, Path<T>>, {
									shouldDirty: true,
									shouldValidate: true,
								});
							}}
						/>
					</InputGroupButton>
					<InputGroupText className="px-2">
						<span
							className={cn(
								"text-xs text-muted-foreground",
								watchedValue.length > 2000 && "text-warning",
								watchedValue.length >= MAX_CAPTION_LENGTH && "text-destructive",
							)}
						>
							{watchedValue.length}/{MAX_CAPTION_LENGTH}
						</span>
					</InputGroupText>
				</InputGroupAddon>
			</InputGroup>
		</Field>
	);
}
