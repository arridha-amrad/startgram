import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authClient } from "#/lib/auth-client";
import {
	folders,
	removeFile,
	transformations,
	uploadToCloudinary,
} from "#/lib/cloudinary.functions";
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
import * as m from "@/paraglide/messages";
import { signupSchema, type TSignupSchema } from "@/zod-schemas/signup-schema";

export default function SignupForm() {
	const navigate = useNavigate();
	const {
		register,
		setValue,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<TSignupSchema>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			fullName: "",
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: TSignupSchema) => {
		let uploadResult: { public_id: string; secure_url: string } | undefined;

		try {
			// 1. Handle Avatar Upload if present
			if (data.avatar) {
				const uploadPromise = uploadToCloudinary(data.avatar, {
					folder: folders.avatar,
					transformation: transformations.avatar,
				});

				toast.promise(uploadPromise, {
					loading: "Uploading avatar...",
					success: "Avatar uploaded!",
					error: "Failed to upload avatar.",
				});

				uploadResult = await uploadPromise;
			}

			// 2. Sign Up User
			const res = await authClient.signUp.email({
				email: data.email,
				name: data.fullName,
				password: data.password,
				username: data.username,
				image: uploadResult?.secure_url,
			});

			if (res.error) {
				// Cleanup uploaded file if signup fails
				if (uploadResult) {
					await removeFile({ data: { public_id: uploadResult.public_id } });
				}
				toast.error(res.error.message || "Signup failed");
				return;
			}

			if (res.data) {
				localStorage.setItem("auth:email", data.email);
				reset();
				toast.success("Account created! Please verify your email.");
				navigate({ to: "/auth/verification" });
			}
		} catch (err) {
			console.error("Signup error:", err);
			toast.error("An unexpected error occurred. Please try again.");
			// Cleanup on unexpected error
			if (uploadResult) {
				await removeFile({ data: { public_id: uploadResult.public_id } });
			}
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
		if (file.size > MAX_FILE_SIZE) {
			toast.error("File is too large (max 5MB)");
			e.target.value = "";
			return;
		}

		setValue("avatar", file, { shouldValidate: true });
	};

	return (
		<fieldset disabled={isSubmitting} className="flex flex-col gap-4">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">
						{m.auth_signup_page_title()}
					</CardTitle>
					<CardDescription>{m.auth_signup_page_description()}</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<FieldGroup>
							{/* Avatar Field */}
							<Field>
								<FieldLabel htmlFor="avatar">
									{m.auth_signup_page_picture_label()}
								</FieldLabel>
								<Input
									id="avatar"
									type="file"
									accept="image/*"
									onChange={handleFileChange}
								/>
								<FieldError errors={[errors.avatar]} />
								<FieldDescription>
									{m.auth_signup_page_picture_description()}
								</FieldDescription>
							</Field>

							{/* Full Name Field */}
							<Field>
								<FieldLabel htmlFor="fullName">
									{m.auth_signup_page_fullname_label()}
								</FieldLabel>
								<Input
									id="fullName"
									type="text"
									placeholder={m.auth_signup_page_fullname_placeholder()}
									{...register("fullName")}
								/>
								<FieldError errors={[errors.fullName]} />
							</Field>

							{/* Username Field */}
							<Field>
								<FieldLabel htmlFor="username">
									{m.auth_signup_page_username_label()}
								</FieldLabel>
								<Input
									id="username"
									type="text"
									placeholder={m.auth_signup_page_username_placeholder()}
									{...register("username")}
								/>
								<FieldError errors={[errors.username]} />
							</Field>

							{/* Email Field */}
							<Field>
								<FieldLabel htmlFor="email">
									{m.auth_signup_page_email_label()}
								</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder={m.auth_signup_page_email_placeholder()}
									{...register("email")}
								/>
								<FieldError errors={[errors.email]} />
							</Field>

							{/* Password Fields */}
							<Field>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<Field>
										<FieldLabel htmlFor="password">
											{m.auth_signup_page_password_label()}
										</FieldLabel>
										<Input
											id="password"
											type="password"
											{...register("password")}
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor="confirmPassword">
											{m.auth_signup_page_confirm_password_label()}
										</FieldLabel>
										<Input
											id="confirmPassword"
											type="password"
											{...register("confirmPassword")}
										/>
									</Field>
								</div>
								<FieldError
									errors={[
										{
											message:
												errors.password?.message ||
												errors.confirmPassword?.message,
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

						{/* Submit Button placed inside form to use native behavior */}
						<Button type="submit" className="w-full mt-6">
							{m.auth_create_account()}
							{isSubmitting && <Loader2 className="animate-spin" />}
						</Button>
					</form>
				</CardContent>
				<CardFooter>
					<div className="w-full text-center text-muted-foreground">
						{m.auth_already_have_account()}{" "}
						<Link
							to="/auth/login"
							className="underline underline-offset-4 hover:text-primary transition-colors"
						>
							{m.auth_signin()}
						</Link>
					</div>
				</CardFooter>
			</Card>

			{/* Terms and Privacy */}
			<FieldDescription className="px-6 text-center text-xs text-muted-foreground">
				{m.auth_signup_page_terms_agreement()}{" "}
				<Link to="/" className="underline hover:text-primary">
					{m.auth_signup_page_terms_link()}
				</Link>{" "}
				{m.auth_signup_page_and()}{" "}
				<Link to="/" className="underline hover:text-primary">
					{m.auth_signup_page_privacy_link()}
				</Link>
				.
			</FieldDescription>
		</fieldset>
	);
}
