import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

// Definisikan rute terproteksi dan publik
const protectedRoutes = [
  "/dashboard",
  "/dashboard/penduduk",
  "/dashboard/kartu-keluarga",
];
const publicRoutes = ["/login", "/register", "/"];
const authRoutes = ["/login", "/register"]; // Rute autentikasi yang akan redirect ke / jika sudah login

// Role yang diizinkan untuk mengakses rute terproteksi
const authorizedRoles = ["admin", "petugas"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  // Ambil cookie session dari request
  const cookie = req.cookies.get("session")?.value;
  let session;

  try {
    // Dekripsi session
    session = await decrypt(cookie);
  } catch (error) {
    console.error("Gagal mendekripsi session:", error);
    // Jika dekripsi gagal, anggap pengguna tidak terautentikasi
    session = null;
  }

  // Jika pengguna tidak terautentikasi dan mencoba mengakses rute terproteksi
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Jika pengguna terautentikasi dengan role "user" dan mencoba mengakses rute terproteksi
  if (isProtectedRoute && session?.userId && session?.role === "user") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Jika pengguna terautentikasi tetapi role tidak diizinkan untuk rute terproteksi
  if (
    isProtectedRoute &&
    session?.userId &&
    !authorizedRoles.includes(session?.role as string)
  ) {
    return NextResponse.redirect(new URL("/?error=unauthorized", req.nextUrl));
  }

  // Jika pengguna terautentikasi dan mencoba mengakses rute autentikasi (/login atau /register)
  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Jika pengguna terautentikasi dengan role "admin" atau "petugas" dan mencoba mengakses rute publik (kecuali /login dan /register)
  if (
    isPublicRoute &&
    !isAuthRoute &&
    session?.userId &&
    authorizedRoles.includes(session?.role as string)
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Lanjutkan ke rute berikutnya
  return NextResponse.next();
}

// Konfigurasi matcher untuk middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
