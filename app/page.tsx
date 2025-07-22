"use client";

import { Button } from "@/components/ui/button";
import { auth, db } from "@/config/firebase-init";
import { decrypt } from "@/lib/utils";
import { useSessionStore } from "@/store/useSession";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import { signOut } from "firebase/auth";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const { session, clearSession } = useSessionStore();
  const { clearUser } = useUserStore();
  const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null);

  useEffect(() => {
    async function validateSession() {
      // Jika tidak ada sesi, arahkan ke login
      // if (!session) {
      //   setIsSessionValid(false);
      //   router.push("/login");
      //   return;
      // }

      try {
        // Dekripsi sesi
        const sessionDecrypted = await decrypt(session);
        console.log("Session decrypted:", sessionDecrypted);

        // Periksa apakah sesi kadaluarsa
        const now = Date.now();
        if (sessionDecrypted) {
          const expiresAtMs = sessionDecrypted?.expiresAt
            ? Date.parse(sessionDecrypted?.expiresAt as string)
            : Infinity; // Fallback jika expiresAt tidak ada
          const expMs = sessionDecrypted.exp
            ? sessionDecrypted.exp * 1000 // Konversi detik ke milidetik
            : Infinity; // Fallback jika exp tidak ada

          if (expiresAtMs < now || expMs < now) {
            console.log("Session expired:", {
              expiresAt: sessionDecrypted.expiresAt,
              exp: sessionDecrypted.exp,
              now,
            });
            clearSession();
            clearUser();
            setIsSessionValid(false);
            router.push("/login");
            return;
          }
        }
        setIsSessionValid(false);
      } catch (error) {
        console.error("Error decrypting session:", error);
        clearSession();
        clearUser();
        setIsSessionValid(false);
        router.push("/login");
      }
    }

    validateSession();
  }, [session]);

  async function handleLogout() {
    try {
      await signOut(auth);
      const response = await axios.post("/api/logout");

      if (response.status === 200) {
        clearSession();
        clearUser();
        setIsSessionValid(false);
        toast.success("Berhasil logout");
        router.push("/login");
      } else {
        toast.error("Gagal menghapus sesi");
      }
    } catch (error) {
      toast.error("Gagal logout");
      console.error("Error:", error);
    }
  }

  if (isSessionValid === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-[70vh]">
      {/* Navbar */}
      <nav className="top-0 right-0 left-0 z-20 absolute bg-transparent">
        <div className="flex justify-between items-center mx-auto px-8 lg:px-32 py-4 md:16">
          <div className="flex flex-col">
            <h2 className="font-semibold text-white text-xl">Desa Bebalang</h2>
            <p className="text-white">Bangli, Bali, Indonesia</p>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Button
                  variant="outline"
                  className="bg-transparent hover:bg-white/10 text-white hover:text-white"
                  onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
                <Link href="/dashboard">
                  <Button className="bg-white hover:bg-gray-200 text-gray-900">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="flex justify-center items-center bg-transparent hover:bg-white/10 text-white hover:text-white">
                  <LogIn className="w-4 h-4" />
                  <p>Login</p>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative flex justify-center items-center h-full overflow-hidden">
        {/* Background Image */}
        <div className="-z-10 absolute inset-0">
          <img
            src="/images/bg-sawah.jpg"
            className="w-full h-full object-center object-cover"
            alt="background"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        {/* Hero Content */}
        <div className="z-10 space-y-4 px-4 text-center">
          <h1 className="font-bold text-white text-2xl md:text-3xl">
            SELAMAT DATANG
          </h1>
          <h2 className="font-semibold text-white text-xl md:text-2xl">
            Sistem Informasi Pendataan Penduduk
          </h2>
          <h3 className="font-normal text-white text-lg md:text-xl">
            Kelurahan Bebalang
          </h3>
        </div>
      </div>
    </div>
  );
}
