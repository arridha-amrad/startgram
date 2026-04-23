import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
	createPostSchema,
	MAX_CAPTION_LENGTH,
	type TCreatePostSchema,
} from "#/zod-schemas/createpost-schema";
import { FieldGroup } from "../../ui/field";
import Accessibility from "../accessibility";
import AdvanceSettings from "../advance-settings";
import { Steps, useCreatePost } from "../create-post-context";
import ShareTo from "../share-to";
import CaptionTextarea from "./caption-textarea";
import CollaboratorsInput from "./collaborators-input";
import LocationInput from "./location-input";

export default function FormCaption() {
	const { formRef, mediaWithTaggedUsers, aspectRatio, setStep } =
		useCreatePost();

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

	const caption = useWatch({ control, name: "caption" }) || "";

	const onSubmit = async (data: TCreatePostSchema) => {
		try {
			setStep(Steps.Submitting);
			await new Promise((res) => setTimeout(res, 3000));
			console.log({ ...data, aspectRatio, media: mediaWithTaggedUsers });
			setStep(Steps.Submitted);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="flex h-full w-full flex-col bg-background">
			<div className="custom-scrollbar flex-1 overflow-y-auto">
				<div className="flex flex-col gap-4 p-4">
					<form
						ref={formRef}
						id="caption-form"
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-2"
					>
						<FieldGroup>
							<div className="relative">
								<div
									className="pointer-events-none absolute inset-0 border border-transparent px-2.5 py-2 text-base wrap-break-word whitespace-pre-wrap md:text-sm"
									aria-hidden="true"
								>
									<span className="text-transparent">
										{caption.slice(0, MAX_CAPTION_LENGTH)}
									</span>
									<span className="rounded-sm bg-destructive/30 text-transparent">
										{caption.slice(MAX_CAPTION_LENGTH)}
									</span>
								</div>

								<CaptionTextarea
									name="caption"
									getValues={getValues}
									setValue={setValue}
									register={register}
									control={control}
								/>
							</div>

							<LocationInput
								name="location"
								setValue={setValue}
								error={errors.location?.message}
							/>

							<Controller
								name="collaborators"
								control={control}
								render={({ field }) => (
									<>
										<CollaboratorsInput field={field} />
										{errors.collaborators && (
											<p className="mt-1 text-xs font-medium text-destructive">
												{errors.collaborators.message}
											</p>
										)}
									</>
								)}
							/>

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
}
