import "server-only";
import { cookies } from "next/headers";
import { decrypt, encrypt } from "./utils";

export async function createServerSession({
  userId,
  nama,
  email,
  role = "user",
}: {
  userId: string;
  nama: string;
  email: string;
  role: string;
}) {
  const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  const session = await encrypt({
    userId,
    nama,
    email,
    role,
    expiresAt,
  });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  return await decrypt(session);
}

export async function getRole() {
  const session = await getSession();
  return session?.role;
}

export async function getUserId() {
  const session = await getSession();
  return session?.userId;
}

export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}
