import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { getSession } from "@/lib/session";
import { db } from "@/config/firebase-init";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Verifikasi sesi untuk memastikan pengguna terautentikasi
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    // Pastikan userId dari sesi cocok dengan parameter
    if (session.userId !== params.userId) {
      return NextResponse.json(
        { success: false, message: "Akses tidak diizinkan" },
        { status: 403 }
      );
    }

    // Ambil data pengguna dari Firestore
    const userDoc = await getDoc(doc(db, "users", params.userId));
    if (!userDoc.exists()) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    return NextResponse.json({
      success: true,
      data: {
        userId: userData.userId,
        nama: userData.nama,
        email: userData.email,
      },
    });
  } catch (error) {
    console.error("Gagal mengambil data pengguna:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pengguna" },
      { status: 500 }
    );
  }
}
