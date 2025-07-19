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

export function calculateAge(birthDate: string): {
  years: number;
  months: number;
  days: number;
} {
  // Validate input format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(birthDate)) {
    throw new Error("Format tanggal lahir harus YYYY-MM-DD");
  }

  const birth = new Date(birthDate);
  const today = new Date();

  // Check if birth date is valid
  if (isNaN(birth.getTime())) {
    throw new Error("Tanggal lahir tidak valid");
  }

  // Check if birth date is not in the future
  if (birth > today) {
    throw new Error("Tanggal lahir tidak boleh di masa depan");
  }

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  // Adjust for negative days
  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  // Adjust for negative months
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}
