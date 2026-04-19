import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "#/components/forms/login-form";
import { LogoIcon } from "#/components/icons/logo";
import AuthFooter from "@/components/footers/auth-footer";

export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex min-h-svh flex-col gap-y-6">
			<div className="grid flex-1 lg:grid-cols-2">
				<div className="flex flex-col gap-4 p-6 md:p-10">
					<div className="flex flex-1 items-center justify-center">
						<div className="w-full max-w-xs flex flex-col gap-6">
							<div className="flex items-center justify-center gap-2 self-center font-medium">
								<LogoIcon />
								Startgram
							</div>
							<LoginForm />
						</div>
					</div>
				</div>
				<div className="relative hidden flex-col justify-center bg-muted lg:flex">
					<div className="">
						<h2 className="scroll-m-20 text-center text-5xl font-extrabold text-balance">
							See everyday moments from your&nbsp;
							<span className="text-primary">close friends.</span>
						</h2>
					</div>
					<div className="mx-auto aspect-square w-lg">
						<img
							src="https://static.cdninstagram.com/rsrc.php/v4/yD/r/nWfBjz-5_uf.png"
							alt="bg"
							className="h-full w-full object-cover"
						/>
					</div>
				</div>
			</div>
			<AuthFooter />
		</div>
	);
}
