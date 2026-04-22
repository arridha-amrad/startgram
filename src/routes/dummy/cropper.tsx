import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";

export const Route = createFileRoute("/dummy/cropper")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AvatarUploader />;
}

// --- Helper Function untuk Canvas Logic ---
const getCroppedImg = async (
	imageSrc: string,
	pixelCrop: Area,
): Promise<Blob | null> => {
	const image = new Image();
	image.src = imageSrc;
	await new Promise((resolve) => (image.onload = resolve));

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) return null;

	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
	);

	return new Promise((resolve) => {
		canvas.toBlob((blob) => resolve(blob), "image/jpeg");
	});
};

const convertBlobToFile = (blob: Blob, fileName: string): File => {
	return new File([blob], fileName, {
		type: blob.type,
		lastModified: Date.now(),
	});
};

// --- Main Component ---
const AvatarUploader: React.FC = () => {
	const [image, setImage] = useState<string | null>(null);
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [loading, setLoading] = useState(false);
	const [croppedImage, setCroppedImage] = useState<File | null>(null);
	const [previewCroppedImage, setPreviewCroppedImage] = useState<string | null>(
		null,
	);

	// 1. Handle pilih file
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener("load", () => setImage(reader.result as string));
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	// 2. Simpan koordinat saat user menggeser kotak
	const onCropComplete = useCallback((_: Area, area: Area) => {
		setCroppedAreaPixels(area);
	}, []);

	// 3. Proses Crop & Upload ke Cloudinary
	const uploadToCloudinary = async () => {
		if (!image || !croppedAreaPixels) return;

		setLoading(true);
		try {
			// console.log(image);

			// // Potong gambar di client
			const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
			if (!croppedBlob) return;

			setCroppedImage(convertBlobToFile(croppedBlob, "avatar.jpeg"));
			setPreviewCroppedImage(URL.createObjectURL(croppedBlob));

			// // Persiapkan FormData untuk Cloudinary
			// const formData = new FormData();
			// formData.append("file", croppedBlob);
			// formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // Ganti ini!
			// formData.append("cloud_name", "YOUR_CLOUD_NAME"); // Ganti ini!

			// const response = await fetch(
			// 	`https://api.cloudinary.com/v1_1/dwa-cloudinary/image/upload`,
			// 	{ method: "POST", body: formData },
			// );

			// const data = await response.json();
			// alert(`Upload Berhasil! URL: ${data.secure_url}`);
			// console.log("Cloudinary Response:", data);
		} catch (error) {
			console.error("Error uploading:", error);
			alert("Gagal mengupload gambar");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ padding: "20px", textAlign: "center" }}>
			<input type="file" accept="image/*" onChange={onFileChange} />

			{image && (
				<div
					style={{
						position: "relative",
						width: "100%",
						height: 400,
						marginTop: 20,
						background: "#333",
					}}
				>
					<Cropper
						image={image}
						crop={crop}
						zoom={zoom}
						aspect={1} // 1:1 untuk Persegi/Avatar
						onCropChange={setCrop}
						onCropComplete={onCropComplete}
						onZoomChange={setZoom}
					/>
				</div>
			)}

			{image && (
				<div style={{ marginTop: 20 }}>
					<label htmlFor="zoom">Zoom: </label>
					<input
						id="zoom"
						type="range"
						min={1}
						max={3}
						step={0.1}
						value={zoom}
						onChange={(e) => setZoom(Number(e.target.value))}
					/>
					<br />
					<button
						type="button"
						onClick={uploadToCloudinary}
						disabled={loading}
						style={{
							marginTop: "10px",
							padding: "10px 20px",
							cursor: "pointer",
						}}
					>
						{loading ? "Uploading..." : "Crop & Upload Avatar"}
					</button>
				</div>
			)}
			<div className="aspect-square rounded-full size-24">
				{previewCroppedImage && (
					<img
						src={previewCroppedImage}
						alt="Preview"
						className="object-cover w-full h-full"
					/>
				)}
			</div>
		</div>
	);
};

export default AvatarUploader;
