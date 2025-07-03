import { auth } from "@/config/firebase-init";
import { destroySession } from "@/lib/session";
import { signOut } from "firebase/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await signOut(auth);
    await destroySession();
    return NextResponse.json(
      { success: true, message: "Berhasil logout" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal logout:", error);
    return NextResponse.json(
      { success: false, message: "Gagal logout" },
      { status: 500 }
    );
  }
}
