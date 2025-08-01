"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/config/firebase-init";
import { useSessionStore } from "@/store/useSession";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import { signOut } from "firebase/auth";
import { LayoutDashboard, LogIn, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ModeToggle } from "./mode-toggle";
import LoadingIcon from "../atoms/loading-icon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/firestore/users";
import LoadingView from "../atoms/loading-view";

interface NavbarProps {
  isInHeroView?: boolean;
}

export default function Navbar({ isInHeroView = false }: NavbarProps) {
  const router = useRouter();
  const { clearSession } = useSessionStore();
  const { clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: userLogin,
    isLoading: isGetUserLoading,
    error,
  } = useQuery({
    queryKey: ["user-login"],
    queryFn: getCurrentUser,
  });

  async function handleLogout() {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="">
      {isGetUserLoading && <LoadingView />}
      <nav
        className={`${
          isInHeroView
            ? "top-0 right-0 left-0 z-20 absolute bg-transparent"
            : "border-b bg-background shadow-sm"
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
          <div className="md:hidden block">
            <Sheet>
              <SheetTrigger className={`${isInHeroView && "text-white"}`}>
                <Menu />
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Sispendu Bebalang</SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="px-8">
                  <div>
                    <h4 className="font-medium text-md text-primary">Tautan</h4>
                    <ul className="space-y-2 mt-2 text-sm">
                      <li>
                        <Link
                          href="/"
                          className="hover:text-primary transition-colors">
                          Beranda
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/about"
                          className="hover:text-primary transition-colors">
                          Tentang
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/sekapur-sirih"
                          className="hover:text-primary transition-colors">
                          Sekapur Sirih
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/contact"
                          className="hover:text-primary transition-colors">
                          Kontak
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/privacy"
                          className="hover:text-primary transition-colors">
                          Kebijakan Privasi
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="px-8">
                  {!isGetUserLoading && userLogin?.data ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        href={
                          userLogin?.data?.role == "admin" ||
                          userLogin?.data?.role == "petugas"
                            ? "/dashboard"
                            : "/preview"
                        }>
                        <Button className="flex items-center gap-2 w-full dark:text-white">
                          <>
                            <LayoutDashboard className="w-4 h-4" />
                            {userLogin?.data?.role == "admin" ||
                            userLogin?.data?.role == "petugas"
                              ? "Dashboard"
                              : "Data Saya"}
                          </>
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className={`bg-transparent hover:bg-white/10 text-primary w-full ${
                          isInHeroView
                            ? "text-white hover:text-white"
                            : "text-gray-900 dark:text-white hover:text-gray-900"
                        }`}
                        onClick={handleLogout}
                        disabled={isLoading}>
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <LoadingIcon />
                            <span>Logging out...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <LogOut className="w-4 h-4" />
                            Logout
                          </div>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="flex justify-center items-center bg-transparent hover:bg-white/10 w-full dark:hover:text-white dark:text-white">
                        <LogIn className="w-4 h-4" />
                        <p>Login</p>
                      </Button>
                    </Link>
                  )}
                  <div className="mt-2">
                    <ModeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:flex md:flex-row flex-col items-center gap-4">
            {!isGetUserLoading && userLogin?.success ? (
              <>
                <Link
                  href={
                    userLogin?.data?.role == "admin" ||
                    userLogin?.data?.role == "petugas"
                      ? "/dashboard"
                      : "/preview"
                  }>
                  <Button className="flex items-center gap-2 dark:text-white">
                    <>
                      <LayoutDashboard className="w-4 h-4" />
                      {userLogin?.data?.role == "admin" ||
                      userLogin?.data?.role == "petugas"
                        ? "Dashboard"
                        : "Data Saya"}
                    </>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className={`bg-transparent hover:bg-white/10 text-primary ${
                    isInHeroView
                      ? "text-white hover:text-white"
                      : "text-gray-900 dark:text-white hover:text-gray-900"
                  }`}
                  onClick={handleLogout}
                  disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <LoadingIcon />
                      <span>Logging out...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </div>
                  )}
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="flex justify-center items-center bg-transparent hover:bg-white/10 hover:text-white dark:text-white">
                  <LogIn className="w-4 h-4" />
                  <p>Login</p>
                </Button>
              </Link>
            )}
            <ModeToggle />
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
