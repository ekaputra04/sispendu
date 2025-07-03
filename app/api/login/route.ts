import { NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createSession } from "@/lib/session";
import { auth, db } from "@/config/firebase-init";

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

    // Ambil role dari Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    // Buat sesi
    await createSession({
      userId: user.uid,
      nama: userDoc.data().nama,
      email,
      role: userDoc.data().role,
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
