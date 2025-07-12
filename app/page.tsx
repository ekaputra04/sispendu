"use client";

import { Button } from "@/components/ui/button";
import { auth, db } from "@/config/firebase-init";
import { decrypt } from "@/lib/utils";
import { useSessionStore } from "@/store/useSession";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import { signOut } from "firebase/auth";
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
      if (!session) {
        setIsSessionValid(false);
        router.push("/login");
        return;
      }

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
    <div className="">
      <Button onClick={handleLogout}>Logout</Button>
      <Link href={"/dashboard"}>
        <Button>Dashboard</Button>
      </Link>
    </div>
  );
}
