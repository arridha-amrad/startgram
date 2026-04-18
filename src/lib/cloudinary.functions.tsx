import { createServerFn } from "@tanstack/react-start";
import { v2 as cloudinary } from "cloudinary";
import { env } from "#/env";

interface CloudinaryUploadResult {
	secure_url: string;
	public_id: string;
}

const initCloudinary = () => {
	cloudinary.config({
		cloud_name: env.CLOUDINARY_CLOUD_NAME,
		api_key: env.CLOUDINARY_KEY,
		api_secret: env.CLOUDINARY_SECRET,
	});
};

export const uploadImage = createServerFn({ method: "POST" })
	.inputValidator((data: FormData) => data)
	.handler(async ({ data }) => {
		initCloudinary();

		const file = data.get("file") as File | null;
		const folderName = data.get("folder-name") as string | null;
		if (!file) throw new Error("No file provided");

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const uploadResult = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						folder: folderName || undefined,
					},
					(error, result) => {
						if (error) reject(error);
						else resolve(result as CloudinaryUploadResult);
					},
				)
				.end(buffer);
		});

		return uploadResult as CloudinaryUploadResult;
	});

export const removeFile = createServerFn({ method: "POST" })
	.inputValidator((data: { public_id: string }) => data)
	.handler(async ({ data }) => {
		initCloudinary();
		const { public_id } = data;
		const result = await cloudinary.uploader.destroy(public_id);
		console.log("remove result : ", result);
		return result;
	});
