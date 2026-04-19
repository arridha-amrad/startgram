import { createFileRoute } from "@tanstack/react-router";
import AuthFooter from "#/components/footers/auth-footer";
import ForgotPasswordForm from "#/components/forms/forgot-password";
import ResetPasswordForm from "#/components/forms/reset-password";
import { LogoIcon } from "#/components/icons/logo";

export const Route = createFileRoute("/auth/reset-password")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex min-h-svh flex-col items-center bg-muted justify-center gap-6 p-6">
			<div className="flex w-full max-w-sm flex-1 flex-col gap-6">
				<div className="flex items-center gap-2 self-center font-medium">
					<LogoIcon />
					Startgram
				</div>
				<ResetPasswordForm />
			</div>
			<AuthFooter />
		</div>
	);
}
