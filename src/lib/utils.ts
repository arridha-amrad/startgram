import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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


