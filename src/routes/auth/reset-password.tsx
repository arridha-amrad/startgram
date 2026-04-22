import { createFileRoute } from "@tanstack/react-router";
import AuthFooter from "#/components/footers/auth-footer";
import ResetPasswordForm from "#/components/forms/resetpwd-form";
import { LogoIcon } from "#/components/icons/logo";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/auth/reset-password")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex min-h-svh flex-col items-center bg-muted justify-center gap-6 p-6">
			<div className="flex w-full max-w-sm flex-1 flex-col gap-6">
				<div className="flex items-center gap-2 self-center font-medium">
					<LogoIcon />
					{m.common_app_name()}
				</div>
				<ResetPasswordForm />
			</div>
			<AuthFooter />
		</div>
	);
}
