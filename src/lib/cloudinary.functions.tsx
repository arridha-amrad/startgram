import { env } from "#/env";
import { createClientOnlyFn, createServerFn } from "@tanstack/react-start";
import { v2 as cloudinary } from "cloudinary";
import z from "zod";

interface CloudinaryUploadResult {
	secure_url: string;
	public_id: string;
}

export const transformations = {
	avatar: "w_400,h_400,c_fill,g_face",
};

export const folders = {
	avatar: "startgram/avatars",
	post: "startgram/posts",
};

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
						resource_type: file.type.startsWith("image") ? "image" : "auto",
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

const data = z.object({
	folderName: z.string().min(3, "please provide a valid folder name"),
});

export const getSignatureFn = createServerFn({ method: "GET" })
	.inputValidator(data)
	.handler(({ data: { folderName } }) => {
		var timestamp = Math.round(Date.now() / 1000);
		// Buat signature (misalnya untuk folder 'video-uploads')
		const signature = cloudinary.utils.api_sign_request(
			{
				timestamp: timestamp,
				folder: folderName,
			},
			env.CLOUDINARY_SECRET,
		);

		return {
			signature,
			timestamp,
			cloudName: env.CLOUDINARY_CLOUD_NAME,
			apiKey: env.CLOUDINARY_KEY,
		};
	});

/**
 * Client-side utility to upload a file directly to Cloudinary using a signed request.
 */
export const uploadToCloudinary = createClientOnlyFn(
	async (file: File, options: { folder: string; transformation?: string }) => {
		try {
			const { apiKey, cloudName, signature, timestamp } = await getSignatureFn({
				data: { folderName: options.folder },
			});

			const formData = new FormData();
			formData.append("file", file);
			formData.append("api_key", apiKey);
			formData.append("signature", signature);
			formData.append("timestamp", timestamp.toString());
			formData.append("folder", options.folder);

			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudName}/${file.type.startsWith("image") ? "image" : "video"}/upload`,
				{
					method: "POST",
					body: formData,
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error?.message || "Upload failed");
			}

			const data = await response.json();
			return data as CloudinaryUploadResult;
		} catch (err) {
			console.error("Cloudinary upload error:", err);
			throw err;
		}
	},
);
