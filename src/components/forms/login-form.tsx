import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Eye, EyeOff, Loader2, RefreshCwIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { db } from "#/db";
import { authClient } from "#/lib/auth-client";
import { loginSchema, type TLoginSchema } from "#/zod-schemas/login-schema";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as m from "@/paraglide/messages";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../ui/input-group";

const findEmailByUsername = createServerFn()
	.inputValidator((username: string) => username)
	.handler(async ({ data }) => {
		const res = await db.query.users.findFirst({
			where: { username: data },
		});
		return res;
	});

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<TLoginSchema>({
		resolver: zodResolver(loginSchema),
	});

	const navigate = useNavigate();

	const [isShowResendVerificationBtn, setIsShowResendVerificationBtn] =
		useState(false);

	const [authError, setAuthError] = useState<string | null>(null);

	const onSubmit = async (data: TLoginSchema) => {
		try {
			const { data: resData, error } = data.identifier.includes("@")
				? await authClient.signIn.email({
						email: data.identifier,
						password: data.password,
					})
				: await authClient.signIn.username({
						username: data.identifier,
						password: data.password,
					});

			if (error) {
				if (error.code) {
					switch (error.code) {
						case "INVALID_EMAIL_OR_PASSWORD":
							setAuthError(m.INVALID_EMAIL_OR_PASSWORD());
							break;
						case "EMAIL_NOT_VERIFIED":
							setAuthError(m.auth_login_page_email_not_verified());
							setIsShowResendVerificationBtn(true);
							break;
					}
				}
				return;
			}

			if (resData) {
				navigate({ to: "/" });
			}
		} catch (err) {
			console.log(err);
		}
	};

	const [isShowPwd, setIsShowPwd] = useState(false);

	const resendVerification = async () => {
		const id = toast.loading("Sending verification code...");
		try {
			const identifier = getValues("identifier");
			const email = identifier.includes("@")
				? identifier
				: (await findEmailByUsername({ data: identifier }))?.email;

			if (!email) {
				toast.error("Email not found");
				return;
			}
			const res = await authClient.emailOtp.sendVerificationOtp({
				email,
				type: "email-verification",
			});
			if (res.error?.message) {
				toast.error(res.error.message);
				return;
			}
			if (res.data) {
				localStorage.setItem("auth:email", email);
				navigate({ to: "/auth/verification" });
			}
		} catch (err) {
			console.log(err);
			toast.error("Something went wrong");
		} finally {
			toast.dismiss(id);
		}
	};

	return (
		<fieldset disabled={isSubmitting}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={cn("flex flex-col gap-6", className)}
				{...props}
			>
				<FieldGroup>
					<div className="flex flex-col items-center gap-1 text-center">
						<h1 className="text-2xl font-bold">{m.auth_login_page_title()}</h1>
						<p
							className={cn(
								"text-sm text-balance",
								authError ? "text-destructive" : "text-muted-foreground",
							)}
						>
							{authError || m.auth_login_page_description()}
						</p>
					</div>
					{isShowResendVerificationBtn && (
						<Field className="justify-center">
							<Button
								type="button"
								onClick={resendVerification}
								variant="outline"
							>
								<RefreshCwIcon />
								{m.auth_login_page_resend_verification()}
							</Button>
						</Field>
					)}
					<Field>
						<FieldLabel htmlFor="identifier">
							{m.auth_login_page_identifier_label()}
						</FieldLabel>
						<Input
							id="identifier"
							placeholder={m.auth_login_page_identifier_placeholder()}
							className="bg-background"
							{...register("identifier")}
						/>
						{!!errors.identifier && (
							<FieldError errors={[{ message: errors.identifier?.message }]} />
						)}
					</Field>
					<Field>
						<div className="flex items-center">
							<FieldLabel htmlFor="password">
								{m.auth_login_page_password_label()}
							</FieldLabel>
							<Link
								to="/auth/forgot-password"
								className="ml-auto text-sm underline-offset-4 hover:underline"
							>
								{m.auth_login_page_forgot_password_link()}
							</Link>
						</div>
						<InputGroup>
							<InputGroupInput
								id="password"
								type={isShowPwd ? "text" : "password"}
								placeholder={m.auth_login_page_password_placeholder()}
								{...register("password")}
							/>
							<InputGroupAddon align="inline-end">
								<Button
									type="button"
									onClick={() => setIsShowPwd((val) => !val)}
									size="icon"
									variant="ghost"
								>
									{isShowPwd ? <Eye /> : <EyeOff />}
								</Button>
							</InputGroupAddon>
						</InputGroup>
						{!!errors.password && (
							<FieldError errors={[{ message: errors.password?.message }]} />
						)}
					</Field>
					<Field>
						<Button type="submit">
							{m.auth_login()}
							{isSubmitting && <Loader2 className="animate-spin" />}
						</Button>
					</Field>
					<FieldSeparator className="*:data-[slot=field-separator-content]:bg-muted dark:*:data-[slot=field-separator-content]:bg-card">
						{m.common_or_continue_with()}
					</FieldSeparator>
					<Field>
						<Button variant="outline" type="button">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<title>Github</title>
								<path
									d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
									fill="currentColor"
								/>
							</svg>
							{m.auth_login_page_github_login()}
						</Button>
						<div className="text-center text-muted-foreground text-sm">
							{m.auth_dont_have_account()}{" "}
							<Link
								to="/auth/signup"
								className="ml-auto underline-offset-4 hover:underline"
							>
								{m.auth_signup()}
							</Link>
						</div>
					</Field>
				</FieldGroup>
			</form>
		</fieldset>
	);
}
