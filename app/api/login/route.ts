import { signInWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import { auth } from "@/config/firebase-init";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password diperlukan" },
        { status: 400 }
      );
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await createSession({
      userId: user.uid,
      role: "user",
    });

    return NextResponse.json(
      { success: true, message: "Berhasil login" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Gagal login:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal login" },
      { status: 401 }
    );
  }
}
