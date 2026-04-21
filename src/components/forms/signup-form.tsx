import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import * as m from "@/paraglide/messages";
import { Loader2 } from "lucide-react";
import { useRef } from "react";
import {
	type FieldErrors,
	type FieldValues,
	type UseFormHandleSubmit,
	type UseFormRegister,
	type UseFormReset,
	type UseFormSetValue,
	useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import { authClient } from "#/lib/auth-client";
import { removeFile, uploadImage } from "#/lib/cloudinary.functions";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { TSignupSchema } from "@/zod-schemas/signup-schema";
import { signupSchema } from "@/zod-schemas/signup-schema";

export default function SignupForm() {
	const formRef = useRef<HTMLFormElement>(null);
	const {
		register,
		setValue,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(signupSchema),
	});

	return (
		<fieldset disabled={isSubmitting} className="flex flex-col gap-4">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">{m.auth_signup_page_title()}</CardTitle>
					<CardDescription>
						{m.auth_signup_page_description()}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form
						ref={formRef}
						reset={reset}
						errors={errors}
						handleSubmit={handleSubmit}
						register={register}
						setValue={setValue}
					/>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button
						onClick={() => formRef.current?.requestSubmit()}
						className="self-stretch"
					>
						{m.auth_create_account()}
						{isSubmitting && <Loader2 className="animate-spin" />}
					</Button>
					<div className="text-center text-muted-foreground">
						{m.auth_already_have_account()}{" "}
						<Link
							to="/auth/login"
							className="ml-auto underline-offset-4 hover:underline"
						>
							{m.auth_signin()}
						</Link>
					</div>
				</CardFooter>
			</Card>
			<FieldDescription className="px-6 text-center">
				{m.auth_signup_page_terms_agreement()} <a href="/">{m.auth_signup_page_terms_link()}</a>{" "}
				{m.auth_signup_page_and()} <a href="/">{m.auth_signup_page_privacy_link()}</a>.
			</FieldDescription>
		</fieldset>
	);
}

type FormProps<T extends FieldValues> = {
	register: UseFormRegister<T>;
	setValue: UseFormSetValue<T>;
	errors: FieldErrors<T>;
	handleSubmit: UseFormHandleSubmit<T>;
	reset: UseFormReset<T>;
	ref: React.RefObject<HTMLFormElement | null>;
};

const Form = ({
	register,
	setValue,
	errors,
	handleSubmit,
	reset,
	ref,
}: FormProps<TSignupSchema>) => {
	const navigate = useNavigate();
	//
	const onSubmit = async ({
		password,
		email,
		fullName,
		username,
		avatar,
	}: TSignupSchema) => {
		let uploadResult: { public_id: string; secure_url: string } | undefined;
		try {
			if (avatar) {
				const formData = new FormData();
				formData.append("file", avatar);
				formData.append("folder-name", "startgram/avatars");
				const res = await uploadImage({ data: formData });
				uploadResult = res;
			}
			const res = await authClient.signUp.email({
				email,
				name: fullName,
				password,
				username,
				image: uploadResult?.secure_url,
			});
			if (res.error) {
				if (res.error.message) {
					toast.error(res.error.message, { duration: 5000 });
				}
				if (uploadResult) {
					await removeFile({ data: { public_id: uploadResult.public_id } });
				}
				return;
			}
			if (res.data) {
				localStorage.setItem("auth:email", email);
				reset();
				toast.success("Account created successfully", { duration: 5000 });
				navigate({ to: "/auth/verification" });
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<form ref={ref} onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="picture">{m.auth_signup_page_picture_label()}</FieldLabel>
					<Input
						id="picture"
						type="file"
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (!file) return;
							if (file.size <= 1024 * 1024 * 5) {
								setValue("avatar", file);
							} else {
								alert("file is too big");
								e.target.value = "";
							}
						}}
					/>
					<FieldError errors={[errors.avatar]} />
					<FieldDescription>{m.auth_signup_page_picture_description()}</FieldDescription>
				</Field>
				<Field>
					<FieldLabel htmlFor="name">{m.auth_signup_page_fullname_label()}</FieldLabel>
					<Input
						id="name"
						type="text"
						placeholder={m.auth_signup_page_fullname_placeholder()}
						{...register("fullName")}
					/>
					<FieldError errors={[errors.fullName]} />
				</Field>
				<Field>
					<FieldLabel htmlFor="username">{m.auth_signup_page_username_label()}</FieldLabel>
					<Input
						id="username"
						type="text"
						placeholder={m.auth_signup_page_username_placeholder()}
						{...register("username")}
					/>
					<FieldError errors={[errors.username]} />
				</Field>
				<Field>
					<FieldLabel htmlFor="email">{m.auth_signup_page_email_label()}</FieldLabel>
					<Input
						id="email"
						type="email"
						placeholder={m.auth_signup_page_email_placeholder()}
						{...register("email")}
					/>
					<FieldError errors={[errors.email]} />
				</Field>
				<Field>
					<Field className="grid grid-cols-2 gap-4">
						<Field>
							<FieldLabel htmlFor="password">{m.auth_signup_page_password_label()}</FieldLabel>
							<Input id="password" type="password" {...register("password")} />
						</Field>
						<Field>
							<FieldLabel htmlFor="confirm-password">
								{m.auth_signup_page_confirm_password_label()}
							</FieldLabel>
							<Input
								id="confirm-password"
								type="password"
								{...register("confirmPassword")}
							/>
						</Field>
					</Field>
					<FieldError
						errors={[
							{
								message:
									errors.password?.message || errors.confirmPassword?.message,
							},
						]}
					/>
					{!errors.password && !errors.confirmPassword && (
						<FieldDescription>
							{m.auth_signup_page_password_hint()}
						</FieldDescription>
					)}
				</Field>
			</FieldGroup>
		</form>
	);
};
