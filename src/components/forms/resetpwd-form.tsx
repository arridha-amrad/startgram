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
import * as m from "@/paraglide/messages";
import { FormInput } from "../form-input";
import { Button } from "../ui/button";
import { Field, FieldGroup } from "../ui/field";

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
				toast.error(m.auth_reset_password_token_not_found());
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
				toast.success(m.auth_reset_password_success_message());
				navigate({ to: "/auth/login" });
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
							{m.auth_reset_password_title()}
						</h1>
						<p className="text-sm text-balance text-muted-foreground">
							{m.auth_reset_password_description()}
						</p>
					</div>

					<FormInput
						label={m.auth_reset_password_password_label()}
						name="password"
						register={register}
						validationError={errors.password?.message}
						placeholder="********"
						type="password"
					/>

					<FormInput
						label={m.auth_reset_password_confirm_password_label()}
						name="confirmPassword"
						register={register}
						validationError={errors.confirmPassword?.message}
						placeholder="********"
						type="password"
					/>

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
