/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
import {
	Bookmark,
	Heart,
	MessageCircle,
	MoreHorizontal,
	Play,
	Send,
	Volume2,
	VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function VideoPostItem() {
	return (
		<Card className="mx-auto max-w-full border-none shadow-none md:max-w-[470px] md:border">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
				<div className="flex items-center gap-3">
					<Avatar className="h-9 w-9">
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="cursor-pointer text-sm font-semibold hover:underline">
							shadcn_design
						</span>
						<span className="text-xs leading-none text-muted-foreground">
							Original Audio
						</span>
					</div>
				</div>
				<Button variant="ghost" size="icon" className="h-8 w-8">
					<MoreHorizontal className="h-5 w-5" />
				</Button>
			</CardHeader>

			<Content />

			<div className="px-4 py-3">
				<div className="mb-3 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Heart className="h-6 w-6 cursor-pointer transition-colors hover:text-primary active:scale-125" />
						<MessageCircle className="h-6 w-6 cursor-pointer transition-colors hover:text-muted-foreground" />
						<Send className="h-6 w-6 cursor-pointer transition-colors hover:text-muted-foreground" />
					</div>
					<Bookmark className="h-6 w-6 cursor-pointer transition-colors hover:text-muted-foreground" />
				</div>

				{/* Caption & Comments */}
				<div className="space-y-1.5">
					<p className="text-sm font-bold">42,903 views</p>
					<p className="text-sm">
						<span className="mr-2 font-bold">shadcn_design</span>
						Watching the waves with this calm teal aesthetic. 🌊✨
					</p>
					<p className="cursor-pointer py-1 text-sm text-muted-foreground">
						View all 128 comments
					</p>
				</div>
			</div>

			{/* Mobile Footer Optimization */}
			<div className="hidden border-t p-3 md:block">
				<div className="flex items-center gap-2">
					<span className="flex-1 text-sm text-muted-foreground">
						Add a comment...
					</span>
					<Button
						variant="ghost"
						size="sm"
						className="font-bold text-primary hover:bg-transparent"
					>
						Post
					</Button>
				</div>
			</div>
		</Card>
	);
}

async function convertToBlob(videoUrl: string) {
	try {
		// 1. Fetch the data from the link
		const response = await fetch(videoUrl);

		// 2. Convert the response into a Blob object
		const videoBlob = await response.blob();

		// 3. Create a unique local URL for that Blob
		const blobUrl = URL.createObjectURL(videoBlob);

		console.log("Your blob URL is:", blobUrl);
		// Output looks like: blob:https://yourdomain.com/random-uuid

		return blobUrl;
	} catch (error) {
		console.error("Conversion failed:", error);
	}
}

function Content() {
	// const videoRef = useRef<HTMLVideoElement>(null)
	// const containerRef = useRef<HTMLDivElement>(null)
	// const [hasError, setHasError] = useState(false)
	// const { isMuted, volume, setGlobalMute } = useVolume()
	// const [isPlaying, setIsPlaying] = useState(true)
	// const [isManuallyPaused, setIsManuallyPaused] = useState(false)

	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [showControls, setShowControls] = useState(false);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		// 1. MutationObserver untuk deteksi Dialog Shadcn
		const mutationObserver = new MutationObserver(() => {
			if (document.querySelector('[role="dialog"]')) {
				video.pause();
				setIsPlaying(false);
			}
		});
		mutationObserver.observe(document.body, { childList: true, subtree: true });

		// 2. Listener untuk pindah tab/aplikasi
		const handleVisibilityChange = () => {
			if (document.hidden) {
				video.pause();
				setIsPlaying(false);
			}
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);

		// 3. Intersection Observer dengan rootMargin "Garis Tengah"
		const intersectionObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const isDialogOpen = !!document.querySelector('[role="dialog"]');

					if (
						entry.isIntersecting &&
						!isDialogOpen &&
						!document.hidden &&
						!hasError
					) {
						video.play().catch(() => {});
						setIsPlaying(true);
					} else {
						video.pause();
						setIsPlaying(false);
					}
				});
			},
			{
				/* rootMargin format: "top right bottom left"
         -50% top dan -50% bottom membuat area observasi menjadi garis tipis di tengah.
      */
				rootMargin: "-50% 0px -50% 0px",
				threshold: 0,
			},
		);

		if (containerRef.current) {
			intersectionObserver.observe(containerRef.current);
		}

		return () => {
			mutationObserver.disconnect();
			intersectionObserver.disconnect();
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [hasError]);

	const togglePlay = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (videoRef.current && !hasError) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setIsPlaying(!isPlaying);

			// Show feedback icon
			setShowControls(true);
			setTimeout(() => setShowControls(false), 500);
		}
	};

	const toggleMute = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (videoRef.current) {
			videoRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	const handleVideoError = () => {
		// console.error("Video failed to load:", src)
		setHasError(true);
		setIsPlaying(false);
	};

	useEffect(() => {
		let blobUrl: string | undefined;
		convertToBlob(
			"https://res.cloudinary.com/dwa-cloudinary/video/upload/kawan_orang_padang_fmiz1d.mp4?_s=vp-3.7.2",
		).then((url) => {
			blobUrl = url;
			const video = videoRef.current;
			if (!video || !blobUrl) return;
			video.src = blobUrl;
		});

		return () => {
			if (blobUrl) URL.revokeObjectURL(blobUrl);
		};
	}, []);

	return (
		<CardContent
			ref={containerRef}
			className="group relative bg-background p-0"
		>
			<div
				className="relative flex aspect-4/5 cursor-pointer items-center justify-center md:aspect-square"
				onClick={togglePlay}
			>
				<video
					ref={videoRef}
					autoPlay
					loop
					muted={isMuted}
					playsInline
					className="h-full w-auto object-cover"
					onError={handleVideoError}
				/>

				{/* Using isPlaying to show/hide an icon */}
				{hasError ? (
					<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center">
						<p className="text-sm font-semibold text-white">
							Video unavailable
						</p>
						<p className="text-xs text-white/80">Please try again later.</p>
					</div>
				) : (
					!isPlaying && (
						<div className="absolute inset-0 flex items-center justify-center bg-black/20">
							<Play className="size-12 fill-foreground text-foreground opacity-80" />
						</div>
					)
				)}
			</div>

			<div className="group/volume absolute right-4 bottom-4 hidden flex-col items-center gap-3 group-hover:flex">
				<button
					type="button"
					onClick={toggleMute}
					className="rounded-full bg-background/60 p-1 backdrop-blur-md transition-colors hover:bg-background/80"
				>
					{isMuted ? (
						<VolumeX className="size-4 text-foreground" />
					) : (
						<Volume2 className="size-4 fill-primary/20 text-foreground" />
					)}
				</button>
			</div>
		</CardContent>
	);
}
