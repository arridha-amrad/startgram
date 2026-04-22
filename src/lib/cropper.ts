import { createClientOnlyFn } from "@tanstack/react-start";
import type { Area } from "react-easy-crop";

export const getCroppedImg = createClientOnlyFn(async ({
  imageSrc,
  pixelCrop,
}: {
  imageSrc: string;
  pixelCrop: Area;
}): Promise<Blob | null> => {
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
});