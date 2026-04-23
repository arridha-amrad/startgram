import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
	createPostSchema,
	MAX_CAPTION_LENGTH,
	type TCreatePostSchema,
} from "#/zod-schemas/createpost-schema";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import Accessibility from "./accessibility";
import AdvanceSettings from "./advance-settings";
import CaptionTextarea from "./caption-textarea";
import { useCreatePost } from "./create-post-context";
import InputCollaborators from "./input-collaborators";
import InputLocation from "./input-location";
import ShareTo from "./share-to";

const FormCaption = () => {
	const { formRef, mediaWithTaggedUsers, aspectRatio } = useCreatePost();
	// const { data: session } = authClient.useSession()
	// const pathname = usePathname()

	const {
		control,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
		register,
	} = useForm<TCreatePostSchema>({
		resolver: zodResolver(createPostSchema),
	});
	const description = useWatch({ control, name: "description" }) || "";

	const onSubmit = (data: TCreatePostSchema) => {
		console.log("Form data:", data);
		console.log("mediaWithTaggedUsers: ", mediaWithTaggedUsers);
		console.log("aspect ratio : ", aspectRatio);
	};

	return (
		<div className="flex h-full w-full flex-col bg-background">
			<div className="custom-scrollbar flex-1 overflow-y-auto">
				<div className="flex flex-col gap-4 p-4">
					{/* Form Content */}
					<form
						ref={formRef}
						id="caption-form"
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-2"
					>
						<FieldGroup>
							{/* Description / Caption */}
							<div className="relative">
								<div
									className="pointer-events-none absolute inset-0 border border-transparent px-2.5 py-2 text-base wrap-break-word whitespace-pre-wrap md:text-sm"
									aria-hidden="true"
								>
									<span className="text-transparent">
										{description.slice(0, MAX_CAPTION_LENGTH)}
									</span>
									<span className="rounded-sm bg-destructive/30 text-transparent">
										{description.slice(MAX_CAPTION_LENGTH)}
									</span>
								</div>
								<CaptionTextarea
									name="description"
									getValues={getValues}
									setValue={setValue}
									register={register}
									control={control}
								/>
							</div>

							{/* Location */}
							<Controller
								name="location"
								control={control}
								render={({ field }) => (
									<Field>
										<FieldLabel>Location</FieldLabel>
										<InputLocation field={field} />
										{errors.location && (
											<p className="mt-1 text-xs font-medium text-destructive">
												{errors.location.message}
											</p>
										)}
									</Field>
								)}
							/>

							{/* Collaborators */}
							<Controller
								name="collaborators"
								control={control}
								render={({ field }) => (
									<>
										<InputCollaborators field={field} />
										{errors.collaborators && (
											<p className="mt-1 text-xs font-medium text-destructive">
												{errors.collaborators.message}
											</p>
										)}
									</>
								)}
							/>

							{/* Extra Settings */}
							<div className="space-y-1">
								<ShareTo />
								<Accessibility />
								<AdvanceSettings />
							</div>
						</FieldGroup>
					</form>
				</div>
			</div>
		</div>
	);
};

export default FormCaption;
