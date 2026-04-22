import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, User } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authClient } from "#/lib/auth-client";
import {
	folders,
	removeFile,
	transformations,
	uploadToCloudinary,
} from "#/lib/cloudinary.functions";
import { getCroppedImg } from "#/lib/cropper";
import { convertBlobToFile } from "#/lib/utils";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
} from "@/components/ui/field";
import * as m from "@/paraglide/messages";
import { signupSchema, type TSignupSchema } from "@/zod-schemas/signup-schema";
import { FormInput } from "../form-input";

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

	const inputFileRef = useRef<HTMLInputElement>(null);
	const [previewCroppedImage, setPreviewCroppedImage] = useState<string | null>(
		null,
	);
	const [pickedImage, setPickedImage] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
		if (file.size > MAX_FILE_SIZE) {
			toast.error("File is too large (max 5MB)");
			e.target.value = "";
			return;
		}
		const reader = new FileReader();
		reader.addEventListener("load", () =>
			setPickedImage(reader.result as string),
		);
		reader.readAsDataURL(file);
	};

	return (
		<>
			<fieldset disabled={isSubmitting} className="flex flex-col gap-4">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl">
							{m.auth_signup_page_title()}
						</CardTitle>
						<CardDescription>
							{m.auth_signup_page_description()}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)}>
							<FieldGroup>
								<Field>
									<div className="h-max flex justify-center">
										<button
											type="button"
											onClick={() => inputFileRef.current?.click()}
											className="size-24 rounded-full bg-muted flex items-center justify-center overflow-hidden cursor-pointer"
										>
											{previewCroppedImage ? (
												<img
													src={previewCroppedImage}
													alt="Avatar preview"
													className="w-full h-full object-cover"
												/>
											) : (
												<User className="size-12 text-muted-foreground" />
											)}
										</button>
									</div>
									<input
										hidden
										ref={inputFileRef}
										type="file"
										accept="image/*"
										onChange={handleFileChange}
									/>
								</Field>

								<FormInput
									name={"fullName"}
									label={m.auth_signup_page_fullname_label()}
									placeholder={m.auth_signup_page_fullname_placeholder()}
									validationError={errors.fullName?.message as string}
									register={register}
								/>

								<FormInput
									name={"username"}
									label={m.auth_signup_page_username_label()}
									placeholder={m.auth_signup_page_username_placeholder()}
									validationError={errors.username?.message as string}
									register={register}
								/>

								<FormInput
									name={"email"}
									label={m.auth_signup_page_email_label()}
									placeholder={m.auth_signup_page_email_placeholder()}
									validationError={errors.email?.message as string}
									register={register}
								/>

								<Field>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormInput
											name={"password"}
											label={m.auth_signup_page_password_label()}
											register={register}
											type="password"
										/>
										<FormInput
											name={"confirmPassword"}
											label={m.auth_signup_page_confirm_password_label()}
											register={register}
											type="password"
										/>
									</div>
									{errors.password || errors.confirmPassword ? (
										<FieldError
											errors={[
												{
													message:
														errors.password?.message ||
														errors.confirmPassword?.message,
												},
											]}
										/>
									) : (
										<FieldDescription>
											{m.auth_signup_page_password_hint()}
										</FieldDescription>
									)}
								</Field>

								<Field>
									<Button type="submit" className="w-full">
										{m.auth_create_account()}
										{isSubmitting && <Loader2 className="animate-spin" />}
									</Button>
								</Field>
							</FieldGroup>
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

			<DialogCropImage
				imageSrc={pickedImage}
				open={!!pickedImage}
				onOpenChange={(open) => {
					if (!open) setPickedImage(null);
				}}
				onCrop={async (file) => {
					setValue("avatar", file, { shouldValidate: true });
					setPreviewCroppedImage(URL.createObjectURL(file));
					setPickedImage(null);
				}}
			/>
		</>
	);
}

const DialogCropImage = ({
	open,
	onOpenChange,
	imageSrc,
	onCrop,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	imageSrc: string | null;
	onCrop: (file: File) => void;
}) => {
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [isCropping, setIsCropping] = useState(false);

	const onCropComplete = useCallback((_: Area, area: Area) => {
		setCroppedAreaPixels(area);
	}, []);

	const handleCrop = async () => {
		if (!imageSrc || !croppedAreaPixels) return;

		setIsCropping(true);
		try {
			const croppedBlob = await getCroppedImg({
				imageSrc,
				pixelCrop: croppedAreaPixels,
			});

			if (croppedBlob) {
				const file = convertBlobToFile(croppedBlob, "avatar.jpg");
				onCrop(file);
			}
		} catch (error) {
			console.error("Crop error:", error);
			toast.error("Failed to crop image");
		} finally {
			setIsCropping(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md overflow-hidden flex flex-col h-[500px]">
				<DialogHeader>
					<DialogTitle>Crop Image</DialogTitle>
					<DialogDescription>
						Drag and zoom to crop your profile picture.
					</DialogDescription>
				</DialogHeader>

				<div className="relative flex-1 bg-muted rounded-md overflow-hidden my-4">
					{imageSrc && (
						<Cropper
							image={imageSrc}
							crop={crop}
							zoom={zoom}
							aspect={1}
							onCropChange={setCrop}
							onCropComplete={onCropComplete}
							onZoomChange={setZoom}
						/>
					)}
				</div>

				<div className="space-y-2">
					<div className="flex items-center gap-4">
						<span className="text-sm font-medium">Zoom</span>
						<input
							type="range"
							min={1}
							max={3}
							step={0.1}
							value={zoom}
							onChange={(e) => setZoom(Number(e.target.value))}
							className="flex-1"
						/>
					</div>
				</div>

				<DialogFooter className="mt-4 gap-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isCropping}
					>
						Cancel
					</Button>
					<Button onClick={handleCrop} disabled={isCropping || !imageSrc}>
						{isCropping ? <Loader2 className="animate-spin" /> : "Apply Crop"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
