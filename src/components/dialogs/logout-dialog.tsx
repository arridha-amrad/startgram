import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { authClient } from "#/lib/auth-client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function LogoutDialog({ children }: { children: ReactNode }) {
	const navigate = useNavigate();
	const handleLogout = async () => {
		try {
			const res = await authClient.signOut();
			if (res.error) {
				throw res.error;
			}
			navigate({ to: "/auth/login" });
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
					<AlertDialogDescription>
						This action will log you out of your account.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleLogout} variant="destructive">
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
