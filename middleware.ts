import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/utils";

// Definisikan rute terproteksi, publik, dan preview
const protectedRoutes = [
  "/dashboard",
  "/dashboard/penduduk",
  "/dashboard/kartu-keluarga",
];
const previewRoutes = [
  "/preview",
  "/preview/penduduk",
  "/preview/kartu-keluarga",
];
const publicRoutes = ["/login", "/register", "/"];
const authRoutes = ["/login", "/register"]; // Rute autentikasi yang akan redirect ke / jika sudah login

// Role yang diizinkan untuk mengakses rute terproteksi
const authorizedRoles = ["admin", "petugas"];
// Role yang diizinkan untuk mengakses rute preview
const previewAuthorizedRoles = ["admin", "petugas", "user"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPreviewRoute = previewRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  // Ambil cookie session dari request
  const cookie = req.cookies.get("session")?.value;
  let session = null;

  try {
    // Dekripsi session
    session = await decrypt(cookie);
  } catch (error) {
    console.error("Gagal mendekripsi session:", error);
    // Jika dekripsi gagal, anggap pengguna tidak terautentikasi
    session = null;
  }

  console.log("session: ", session);

  // Jika pengguna tidak terautentikasi dan mencoba mengakses rute terproteksi
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Jika pengguna tidak terautentikasi dan mencoba mengakses rute preview
  if (isPreviewRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Jika pengguna terautentikasi dengan role yang tidak diizinkan untuk rute terproteksi
  if (
    isProtectedRoute &&
    session?.userId &&
    !authorizedRoles.includes(session?.role as string)
  ) {
    return NextResponse.redirect(new URL("/?error=unauthorized", req.nextUrl));
  }

  // Jika pengguna terautentikasi dengan role yang tidak diizinkan untuk rute preview
  if (
    isPreviewRoute &&
    session?.userId &&
    !previewAuthorizedRoles.includes(session?.role as string)
  ) {
    return NextResponse.redirect(new URL("/?error=unauthorized", req.nextUrl));
  }

  // Jika pengguna terautentikasi dan mencoba mengakses rute autentikasi (/login atau /register)
  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Lanjutkan ke rute berikutnya
  return NextResponse.next();
}

// Konfigurasi matcher untuk middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
