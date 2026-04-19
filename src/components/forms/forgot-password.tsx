import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { env } from "#/env";
import { authClient } from "#/lib/auth-client";
import { cn } from "#/lib/utils";
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
			toast.error("Something went wrong");
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
						<h1 className="text-2xl font-bold">Forgot Password</h1>
						<p
							className={cn(
								"text-sm text-balance",
								isSubmitSuccessful ? "text-green-500" : "text-muted-foreground",
							)}
						>
							{isSubmitSuccessful
								? "Password reset email sent successfully"
								: "Enter your email below to reset your password"}
						</p>
					</div>

					<Field>
						<FieldLabel htmlFor="email">Email</FieldLabel>
						<Input
							id="email"
							placeholder="m@example.com"
							className="bg-background"
							{...register("email")}
						/>
						{!!errors.email && (
							<FieldError errors={[{ message: errors.email?.message }]} />
						)}
					</Field>

					<Field>
						<Button type="submit">
							Submit
							{isSubmitting && <Loader2 className="animate-spin" />}
						</Button>
					</Field>

					<Field>
						<div className="text-center text-sm text-muted-foreground">
							Back to?{" "}
							<Link
								to="/auth/login"
								className="ml-auto underline-offset-4 hover:underline"
							>
								Login
							</Link>
						</div>
					</Field>
				</FieldGroup>
			</form>
		</fieldset>
	);
}
