import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import CarouselContainer from "./carousel-container";
import { useCreatePost } from "./create-post-context";
import { TaggedUserList } from "./tag-user";
import TagUserInput from "./tag-user-input";

export default function Preview() {
	const { mediaWithTaggedUsers, aspectRatio } = useCreatePost();
	const [isShowTagUserInput, setIsShowTagUserInput] = useState(false);
	const [coordinate, setCoordinate] = useState({ x: 0, y: 0 });

	const [isShowTagAlert, setIShowTagAlert] = useState(true);

	const inputRef = useRef<HTMLInputElement>(null);

	const emblaRefs = useRef<Array<HTMLDivElement | null>>([]);

	const handleImageClick = (
		e:
			| React.MouseEvent<HTMLImageElement | HTMLVideoElement>
			| React.KeyboardEvent<HTMLImageElement | HTMLVideoElement>,
		order: number,
	) => {
		setIShowTagAlert(false);
		setSelectedIndex(order);
		// Ambil dimensi gambar saat ini
		const rect = e.currentTarget.getBoundingClientRect();

		let x = 50;
		let y = 50;

		if ("clientX" in e) {
			// Hitung posisi klik dalam persen dan bulatkan ke 2 desimal
			x = Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
			y = Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));
		}

		setIsShowTagUserInput(true);

		setCoordinate({ x, y });

		setTimeout(() => {
			inputRef.current?.focus();
		}, 200);
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLImageElement | HTMLVideoElement>,
		order: number,
	) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleImageClick(e, order);
		}
	};

	const closeInput = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setIsShowTagUserInput(false);
	};

	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	return (
		<CarouselContainer
			isLocked={isShowTagUserInput}
			aspectRatio={aspectRatio}
			url={mediaWithTaggedUsers.map((item) => item.src)}
			isDragEnabled={false}
		>
			<div className="-ml-4 flex touch-pan-y touch-pinch-zoom">
				{mediaWithTaggedUsers.map((item, i) => (
					<div
						className={cn("relative h-full w-full overflow-hidden")}
						style={{
							aspectRatio,
							transform: "translate3d(0, 0, 0)",
							flex: "0 0 100%",
							minWidth: 0,
							paddingLeft: "",
						}}
						ref={(el) => {
							if (el) {
								emblaRefs.current[i] = el;
							}
						}}
						key={item.src}
					>
						{isShowTagAlert && (
							<div className="absolute top-5 left-1/2 z-999 flex -translate-x-1/2 flex-col items-center gap-0">
								<div className="rounded-md bg-background/90 px-4 py-3 shadow-md backdrop-blur">
									<h1 className="text-base font-medium">Click to tag user</h1>
								</div>
								<div className="-mt-1.5 size-3 rotate-45 bg-background/90 backdrop-blur" />
							</div>
						)}

						{item.type === "video" ? (
							<div className="flex h-full w-full items-center justify-center">
								<video
									src={item.src}
									className="h-full w-auto cursor-big-plus"
									onClick={(e) => handleImageClick(e, i)}
									onKeyDown={(e) => handleKeyDown(e, i)}
									tabIndex={0}
									aria-label="Click to tag user"
									muted
									loop
									autoPlay
								/>
							</div>
						) : (
							<img
								src={item.src}
								alt="post"
								className="h-full w-full cursor-big-plus object-cover"
								style={{ aspectRatio }}
								onClick={(e) => handleImageClick(e, i)}
								onKeyDown={(e) => handleKeyDown(e, i)}
							/>
						)}

						{isShowTagUserInput && selectedIndex === i && (
							<TagUserInput
								imageOrder={i}
								closeInput={closeInput}
								emblaRefs={emblaRefs}
								coordinate={coordinate}
								inputRef={inputRef}
								setCoordinate={setCoordinate}
							/>
						)}

						<TaggedUserList
							imageOrder={i}
							taggedUsers={item.taggedUsers}
							emblaRefs={emblaRefs}
						/>
					</div>
				))}
			</div>
		</CarouselContainer>
	);
}
