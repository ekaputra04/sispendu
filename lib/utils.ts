import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SessionPayload } from "./definitions";
import { jwtVerify, SignJWT } from "jose";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const secretKey = process.env.NEXT_PUBLIC_SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

export async function handleCopy(text: string) {
  try {
    if (!text) {
      toast.error("Tidak ada teks untuk disalin");
      return;
    }
    await navigator.clipboard.writeText(text);
    toast.success("Teks berhasil disalin ke clipboard");
  } catch (error: any) {
    console.error("Gagal menyalin teks:", error);
    toast.error("Gagal menyalin teks");
  }
}
