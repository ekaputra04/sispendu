import { NextResponse } from "next/server";
import { createServerSession } from "@/lib/session";
import { decrypt } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { session } = await request.json();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Session diperlukan" },
        { status: 400 }
      );
    }

    const decryptedSession = await decrypt(session);

    await createServerSession({
      userId: decryptedSession?.userId as string,
      nama: decryptedSession?.nama as string,
      email: decryptedSession?.email as string,
      role: decryptedSession?.role as string,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil membuat sesi login",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal membuat sesi login" },
      { status: 401 }
    );
  }
}
