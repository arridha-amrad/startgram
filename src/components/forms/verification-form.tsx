import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, RefreshCwIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authClient } from "#/lib/auth-client";
import {
	type TVerificationSchema,
	verificationSchema,
} from "#/zod-schemas/verification-schema";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "../ui/input-otp";

export default function VerificationForm() {
	const {
		reset,
		control,
		setValue,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<TVerificationSchema>({
		resolver: zodResolver(verificationSchema),
	});

	const navigate = useNavigate();

	const onSubmit = async (data: TVerificationSchema) => {
		try {
			const res = await authClient.emailOtp.verifyEmail({
				email: data.email,
				otp: data.otp,
			});
			if (res.data) {
				reset();
				toast.success("Verification successful", { duration: 5000 });
				localStorage.removeItem("auth:email");
				navigate({ to: "/" });
			}
		} catch (err) {
			console.log(err);
		}
	};

	const formRef = useRef<HTMLFormElement>(null);

	const [email, setEmail] = useState<string>("");

	useEffect(() => {
		const email = localStorage.getItem("auth:email");
		if (email) {
			setValue("email", email);
			setEmail(email);
		}
	}, [setValue]);

	const resendVerification = async () => {
		const id = toast.loading("Sending verification code...");
		try {
			const res = await authClient.emailOtp.sendVerificationOtp({
				email,
				type: "email-verification",
			});
			if (!res.error) {
				toast.success("Verification code sent", { duration: 5000 });
			} else {
				if (res.error.message) {
					toast.error(res.error.message, { duration: 5000 });
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			toast.dismiss(id);
		}
	};

	return (
		<fieldset disabled={isSubmitting}>
			<form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
				<Card>
					<CardHeader>
						<CardTitle>Verify your email</CardTitle>
						<CardDescription className="text-green-600">
							An email has been sent to {email}. Please check to get the otp
							code.
						</CardDescription>
					</CardHeader>

					<CardContent className="flex justify-center">
						<Field>
							<div className="flex items-center justify-between">
								<FieldLabel htmlFor="otp-verification">
									Verification code
								</FieldLabel>
								<Button
									onClick={resendVerification}
									variant="outline"
									size="xs"
								>
									<RefreshCwIcon />
									Resend Code
								</Button>
							</div>

							<Controller
								control={control}
								name="otp"
								render={({ field }) => (
									<InputOTP
										onComplete={() => formRef.current?.requestSubmit()}
										{...field}
										maxLength={6}
									>
										<InputOTPGroup>
											<InputOTPSlot className="size-14 text-2xl" index={0} />
											<InputOTPSlot className="size-14 text-2xl" index={1} />
											<InputOTPSlot className="size-14 text-2xl" index={2} />
										</InputOTPGroup>
										<InputOTPSeparator />
										<InputOTPGroup>
											<InputOTPSlot className="size-14 text-2xl" index={3} />
											<InputOTPSlot className="size-14 text-2xl" index={4} />
											<InputOTPSlot className="size-14 text-2xl" index={5} />
										</InputOTPGroup>
									</InputOTP>
								)}
							/>

							<FieldError errors={[{ message: errors.otp?.message }]} />
						</Field>
					</CardContent>

					<CardFooter className="justify-stretch">
						<Field>
							<Button type="submit" className="w-full">
								Verify
								{isSubmitting && <Loader2 className="animate-spin" />}
							</Button>
							<FieldDescription className="text-center">
								Back to <Link to="/auth/login">Sign in</Link>
							</FieldDescription>
						</Field>
					</CardFooter>
				</Card>
			</form>
		</fieldset>
	);
}
