import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCreatePost } from "./create-post-context";

type Props = {
	setOpen: (value: boolean) => void;
	open: boolean;
	closeCreatePostDialog: () => void;
};

export default function DiscardCreatePostDialog({
	setOpen,
	open,
	closeCreatePostDialog,
}: Props) {
	const { reset } = useCreatePost();
	const discard = () => {
		reset();
		setOpen(false);
		closeCreatePostDialog();
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent className="text-center sm:max-w-sm">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-center">
						Discard post?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-center">
						If you leave, your edits won't be saved.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setOpen(false)}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction variant={"destructive"} onClick={discard}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
