import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Tidak ada sesi aktif" },
        { status: 401 }
      );
    }
    return NextResponse.json({
      success: true,
      data: { userId: session.userId },
    });
  } catch (error) {
    console.error("Gagal mengambil sesi:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil sesi" },
      { status: 500 }
    );
  }
}
