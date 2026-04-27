import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(price);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function normalizeImageUrl(raw: string): string {
  // Google Drive: /file/d/ID/view → thumbnail direto (funciona como background-image)
  const driveFile = raw.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (driveFile) return `https://drive.google.com/thumbnail?id=${driveFile[1]}&sz=w1920`;
  // Google Drive: open?id=ID
  const driveOpen = raw.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (driveOpen) return `https://drive.google.com/thumbnail?id=${driveOpen[1]}&sz=w1920`;
  // Google Drive: uc?id=ID ou uc?export=view&id=ID (já convertido antes)
  const driveUc = raw.match(/drive\.google\.com\/uc\?(?:export=\w+&)?id=([^&]+)/);
  if (driveUc) return `https://drive.google.com/thumbnail?id=${driveUc[1]}&sz=w1920`;
  return raw;
}
