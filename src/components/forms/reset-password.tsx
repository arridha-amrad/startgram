import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authClient } from "#/lib/auth-client";
import { cn } from "#/lib/utils";
import {
	resetpwdSchema,
	type TResetPwdSchema,
} from "#/zod-schemas/resetpwd-schema";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export default function ResetPasswordForm() {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<TResetPwdSchema>({
		resolver: zodResolver(resetpwdSchema),
	});

	const navigate = useNavigate();

	const onSubmit = async (data: TResetPwdSchema) => {
		try {
			const token = new URLSearchParams(window.location.search).get("token");
			if (!token) {
				toast.error("Token not found");
				return;
			}
			const { data: resData, error } = await authClient.resetPassword({
				newPassword: data.password,
				token,
			});
			if (error?.message) {
				toast.error(error.message);
				return;
			}
			if (resData) {
				toast.success("Password reset successfully");
				navigate({ to: "/auth/login" });
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
						<h1 className="text-2xl font-bold">Reset Password</h1>
						<p className="text-sm text-balance text-muted-foreground">
							Enter your email below to reset your password
						</p>
					</div>

					<Field>
						<FieldLabel htmlFor="password">Password</FieldLabel>
						<Input
							id="password"
							placeholder="********"
							className="bg-background"
							{...register("password")}
						/>
						{!!errors.password && (
							<FieldError errors={[{ message: errors.password?.message }]} />
						)}
					</Field>

					<Field>
						<FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
						<Input
							id="confirmPassword"
							placeholder="********"
							className="bg-background"
							{...register("confirmPassword")}
						/>
						{!!errors.confirmPassword && (
							<FieldError
								errors={[{ message: errors.confirmPassword?.message }]}
							/>
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
