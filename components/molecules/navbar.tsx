"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/config/firebase-init";
import { decrypt } from "@/lib/utils";
import { useSessionStore } from "@/store/useSession";
import { useUserStore } from "@/store/useUserStore";
import { IconDashboard } from "@tabler/icons-react";
import axios from "axios";
import { signOut } from "firebase/auth";
import { LayoutDashboard, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface NavbarProps {
  isInHeroView?: boolean;
}

export default function Navbar({ isInHeroView = false }: NavbarProps) {
  const router = useRouter();
  const { session, clearSession } = useSessionStore();
  const { clearUser } = useUserStore();
  const [isAdmin, setIsAdmin] = useState(false);

  async function handleLogout() {
    try {
      await signOut(auth);
      const response = await axios.post("/api/logout");

      if (response.status === 200) {
        clearSession();
        clearUser();
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

  useEffect(() => {
    async function checkAdminStatus() {
      const sessionDecrypted = await decrypt(session);
      console.log("Session decrypted:", sessionDecrypted);

      if (
        sessionDecrypted?.role == "admin" ||
        sessionDecrypted?.role == "petugas"
      ) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }

    checkAdminStatus();
  }, [session]);
  return (
    <div className="">
      <nav
        className={`${
          isInHeroView
            ? "top-0 right-0 left-0 z-20 absolute bg-transparent"
            : "border-b bg-white shadow-sm"
        }`}>
        <div className="flex justify-between items-center mx-auto px-8 lg:px-32 py-4 md:16">
          <Link href={"/"}>
            <div className="flex flex-col">
              <h2
                className={`font-semibold text-xl ${
                  isInHeroView && "text-white"
                }`}>
                Kelurahan Bebalang
              </h2>
              <p className={`text-sm ${isInHeroView && "text-white"}`}>
                Bangli, Bali, Indonesia
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href={isAdmin ? "/dashboard" : "/preview"}>
                  <Button>
                    <>
                      <LayoutDashboard className="w-4 h-4" />
                      {isAdmin ? "Dashboard" : "Data Saya"}
                    </>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className={`bg-transparent hover:bg-white/10 ${
                    isInHeroView
                      ? "text-white hover:text-white"
                      : "text-gray-900 hover:text-gray-900"
                  }`}
                  onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
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
      {!isInHeroView && (
        <div className="h-32 overflow-hidden">
          <img src="/images/bg-sawah.jpg" alt="" />
        </div>
      )}
    </div>
  );
}
