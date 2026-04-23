import { ChevronLeft, Loader } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import FormCaption from "./caption-form";
import { Steps, useCreatePost } from "./create-post-context";
import DiscardCreatePostDialog from "./discard-create-post-dialog";
import PhotosVideosPicker from "./photos-videos-picker";
import Preview from "./preview";

type Props = {
	children: ReactNode;
};

export function CreatePostDialog({ children }: Props) {
	const [open, setOpen] = useState(false);
	const {
		formRef,
		nextStep,
		prevStep,
		step,
		mediaWithTaggedUsers,
		aspectRatio,
		reset,
	} = useCreatePost();
	const [showConfirm, setShowConfirm] = useState(false);

	const triggerSubmit = () => {
		formRef.current?.requestSubmit();
	};

	useEffect(() => {
		if (open && step === Steps.Submitted) {
			setOpen(false);
			reset();
		}
	}, [open, step, reset]);

	const handleCloseAttempt = () => {
		setShowConfirm(true);
	};
	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(v) =>
					v
						? setOpen(true)
						: mediaWithTaggedUsers.length > 0
							? handleCloseAttempt()
							: setOpen(false)
				}
			>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent
					onPointerDownOutside={(e) => {
						if (step === Steps.Submitting) e.preventDefault();
					}}
					onEscapeKeyDown={(e) => {
						if (step === Steps.Submitting) e.preventDefault();
					}}
					showCloseButton={false}
					className="flex w-max flex-col gap-0 overflow-hidden p-0 ring-2 ring-muted sm:max-w-full"
				>
					<DialogHeader className="p-2">
						<DialogTitle asChild>
							<div className="flex w-full items-center justify-between text-sm">
								<div>
									{step > Steps.Picker && (
										<Button
											variant="ghost"
											size={"icon"}
											onClick={prevStep}
											type="button"
										>
											<ChevronLeft />
										</Button>
									)}
								</div>
								<h1 className="font-semibold">Create new post</h1>
								<div>
									{step >= Steps.Picker && mediaWithTaggedUsers.length > 0 ? (
										step >= Steps.MakeCaption ? (
											<Button
												variant="ghost"
												onClick={triggerSubmit}
												type="button"
											>
												{step === Steps.Submitting && (
													<Loader className="animate-spin" />
												)}
												Share
											</Button>
										) : (
											<Button variant="ghost" onClick={nextStep} type="button">
												Next
											</Button>
										)
									) : null}
								</div>
							</div>
						</DialogTitle>
						<DialogDescription className="sr-only">
							Create a new post dialog
						</DialogDescription>
					</DialogHeader>

					<div className={cn("flex h-[70vh] overflow-hidden")}>
						{step === Steps.Picker && (
							<div style={{ aspectRatio }}>
								<PhotosVideosPicker />
							</div>
						)}
						<AnimatePresence mode="popLayout">
							{step > Steps.Picker && (
								<div className="flex">
									<motion.div
										layout
										key="preview-container"
										style={{ aspectRatio }}
										transition={{
											type: "spring",
											bounce: 0,
											duration: 0.6,
										}}
									>
										<Preview />
									</motion.div>

									{step > Steps.Preview && (
										<motion.div
											key="form-create-post"
											className="w-xs"
											initial={{ x: 100, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											exit={{ x: 100, opacity: 0 }}
											transition={{
												type: "spring",
												damping: 25,
												stiffness: 200,
											}}
										>
											<FormCaption />
										</motion.div>
									)}
								</div>
							)}
						</AnimatePresence>
					</div>
				</DialogContent>
			</Dialog>
			<DiscardCreatePostDialog
				closeCreatePostDialog={() => setOpen(false)}
				setOpen={setShowConfirm}
				open={showConfirm}
			/>
		</>
	);
}
