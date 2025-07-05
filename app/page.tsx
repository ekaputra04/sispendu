"use client";

import { Button } from "@/components/ui/button";
import { auth, db } from "@/config/firebase-init";
import axios from "axios";
import { signOut } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  async function handleLogout() {
    try {
      await signOut(auth);

      const response = await axios.post("/api/logout");

      if (response.status === 200) {
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

  return (
    <div className="">
      <Button onClick={handleLogout}>Logout</Button>
      <Link href={"/dashboard"}>
        <Button>Dashboard</Button>
      </Link>
    </div>
  );
}
