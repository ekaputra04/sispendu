import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { createSession } from "@/lib/session";
import { auth, db } from "@/config/firebase-init";

export async function POST(request: Request) {
  try {
    const { email, password, passwordConfirm, name } = await request.json();

    if (!email || !password || !passwordConfirm || !name) {
      return NextResponse.json(
        { success: false, message: "Semua field diperlukan" },
        { status: 400 }
      );
    }

    if (password !== passwordConfirm) {
      return NextResponse.json(
        {
          success: false,
          message: "Password dan konfirmasi password tidak cocok",
        },
        { status: 400 }
      );
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      userId: user.uid,
      nama: name,
      email: email,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createSession({
      userId: user.uid,
      role: "user",
    });

    return NextResponse.json(
      { success: true, message: "Akun berhasil dibuat" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Gagal register:", error);
    if (error.code === "auth/email-already-in-use") {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || "Gagal membuat akun" },
      { status: 500 }
    );
  }
}
