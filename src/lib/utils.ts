import { createClientOnlyFn } from "@tanstack/react-start";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPublicIdFromUrl = (url: string) => {
  const parts = url.split('/');

  const startIndex = parts.indexOf('startgram');

  if (startIndex === -1) return null;

  const publicIdWithExtension = parts.slice(startIndex).join('/');

  return publicIdWithExtension.replace(/\.[^/.]+$/, "");
};


export const convertBlobToFile = createClientOnlyFn((
  blob: Blob,
  fileName: string,
): File => {
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now(),
  });
});