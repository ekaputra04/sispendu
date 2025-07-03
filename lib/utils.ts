import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
