import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { env } from "#/env";
import { authClient } from "#/lib/auth-client";
import { cn } from "#/lib/utils";
import * as m from "@/paraglide/messages";
import {
	forgotpwdSchema,
	type TForgotPwdSchema,
} from "@/zod-schemas/forgotpwd-schema";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export default function ForgotPasswordForm() {
	const {
		handleSubmit,
		register,
		reset,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = useForm<TForgotPwdSchema>({
		resolver: zodResolver(forgotpwdSchema),
	});

	const onSubmit = async (data: TForgotPwdSchema) => {
		try {
			const { data: resData, error } = await authClient.requestPasswordReset({
				email: data.email,
				redirectTo: `${env.VITE_APP_URL}/auth/reset-password`,
			});
			if (error?.message) {
				toast.error(error.message);
				return;
			}
			if (resData) {
				reset();
			}
		} catch (err) {
			console.log(err);
			toast.error(m.common_error_generic());
		}
	};

	return (
		<fieldset disabled={isSubmitting}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={cn("flex flex-col gap-6")}
			>
				<FieldGroup>
					<div className="flex flex-col items-center gap-1 text-center">
						<h1 className="text-2xl font-bold">
							{m.auth_forgot_password_title()}
						</h1>
						<p
							className={cn(
								"text-sm text-balance",
								isSubmitSuccessful ? "text-green-500" : "text-muted-foreground",
							)}
						>
							{isSubmitSuccessful
								? m.auth_forgot_password_success_message()
								: m.auth_forgot_password_description()}
						</p>
					</div>

					<Field>
						<FieldLabel htmlFor="email">
							{m.auth_forgot_password_email_label()}
						</FieldLabel>
						<Input
							id="email"
							placeholder={m.auth_forgot_password_email_placeholder()}
							className="bg-background"
							{...register("email")}
						/>
						{!!errors.email && (
							<FieldError errors={[{ message: errors.email?.message }]} />
						)}
					</Field>

					<Field>
						<Button type="submit">
							{m.common_submit()}
							{isSubmitting && <Loader2 className="animate-spin" />}
						</Button>
					</Field>

					<Field>
						<div className="text-center text-sm text-muted-foreground">
							{m.common_back_to()}{" "}
							<Link
								to="/auth/login"
								className="ml-auto underline-offset-4 hover:underline"
							>
								{m.auth_login()}
							</Link>
						</div>
					</Field>
				</FieldGroup>
			</form>
		</fieldset>
	);
}
