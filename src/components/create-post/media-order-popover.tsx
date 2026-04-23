import type { DragEndEvent } from "@dnd-kit/core";
import {
	closestCenter,
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, Plus, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "../ui/popover";
import type { MediaType } from "./create-post-context";
import { useCreatePost } from "./create-post-context";

function SortableItem({
	item,
	isSmall,
	onRemove,
}: {
	item: { src: string; type: MediaType };
	isSmall: boolean;
	onRemove: (src: string) => void;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: item.src });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 50 : undefined,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"relative cursor-grab touch-none active:cursor-grabbing",
				isDragging && "z-50",
			)}
			{...attributes}
			{...listeners}
		>
			<div className="group relative">
				<div
					className={cn(
						isSmall ? "size-16" : "size-24",
						"aspect-square overflow-hidden",
					)}
				>
					{item.type === "image" ? (
						<img
							src={item.src}
							alt="media"
							className={cn(
								"pointer-events-none h-full w-full rounded-md object-cover",
							)}
						/>
					) : (
						<video
							src={item.src}
							muted
							className={cn(
								"pointer-events-none h-full w-full rounded-md object-cover",
							)}
						/>
					)}
				</div>
				<div className="absolute inset-0 bg-black/50 transition-colors group-hover:bg-transparent"></div>
				<div
					className={cn(
						"absolute text-foreground/50 group-hover:text-foreground",
						isSmall ? "top-0.5 right-0.5" : "top-1 right-1",
					)}
				>
					<button
						type="button"
						title="remove"
						className="pointer-events-auto rounded-full bg-black/50 p-1"
						onPointerDown={(e) => e.stopPropagation()}
						onClick={() => onRemove(item.src)}
					>
						<X className={cn(isSmall ? "size-2" : "size-3")} />
					</button>
				</div>
			</div>
		</div>
	);
}

export default function MediaOrderPopover() {
	const { mediaWithTaggedUsers, setMediaWithTaggedUsers, addMedia } =
		useCreatePost();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	const removeMedia = (src: string) => {
		setMediaWithTaggedUsers(
			mediaWithTaggedUsers.filter((item) => item.src !== src),
		);
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const arrFiles = Array.from(files);
			addMedia(
				arrFiles.map((file) => ({
					file: file,
					src: URL.createObjectURL(file),
					type: file.type.startsWith("image") ? "image" : "video",
				})),
			);
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = mediaWithTaggedUsers.findIndex(
				(item) => item.src === active.id,
			);
			const newIndex = mediaWithTaggedUsers.findIndex(
				(item) => item.src === over.id,
			);

			setMediaWithTaggedUsers(
				arrayMove(mediaWithTaggedUsers, oldIndex, newIndex),
			);
		}
	};

	const inputFileRef = useRef<HTMLInputElement>(null);
	const isSmall = mediaWithTaggedUsers.length > 4;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="secondary" size={"icon-sm"}>
					<Copy />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				align="end"
				className="w-max bg-black/80 backdrop-blur"
			>
				<PopoverHeader>
					<PopoverTitle className="sr-only">Media Order</PopoverTitle>
					<PopoverDescription className="sr-only">
						Control the order of your content
					</PopoverDescription>
				</PopoverHeader>

				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={mediaWithTaggedUsers.map((item) => item.src)}
						strategy={rectSortingStrategy}
					>
						<div className="flex w-max max-w-sm flex-wrap gap-2">
							{mediaWithTaggedUsers.map((item) => (
								<SortableItem
									key={item.src}
									item={item}
									isSmall={isSmall}
									onRemove={removeMedia}
								/>
							))}
							<div className="flex items-center justify-center">
								<input
									ref={inputFileRef}
									onChange={handleFileChange}
									multiple
									accept="image/*"
									type="file"
									hidden
								/>
								<button
									type="button"
									className="flex size-14 items-center justify-center rounded-md border border-dashed border-foreground/20 transition-colors hover:bg-foreground/10"
									onClick={() => inputFileRef.current?.click()}
								>
									<Plus className="size-5" />
								</button>
							</div>
						</div>
					</SortableContext>
				</DndContext>
			</PopoverContent>
		</Popover>
	);
}
