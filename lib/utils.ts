import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SessionPayload } from "./definitions";
import { jwtVerify, SignJWT } from "jose";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchSession() {
  const response = await axios.get("/api/session");
  if (!response.data.success) {
    throw new Error(response.data.message || "Gagal mengambil sesi");
  }
  return response.data.data.userId;
}

export async function fetchUserById(userId: string) {
  const response = await axios.get(`/api/users/${userId}`);
  if (!response.data.success) {
    throw new Error(response.data.message || "Gagal mengambil data pengguna");
  }

  console.log(response.data.data);

  return response.data.data;
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
