"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import LoadingIcon from "../atoms/loading-icon";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase-init";
import { getUserById } from "@/lib/firestore/users";
import { useSessionStore } from "@/store/useSession";
import { SessionPayload } from "@/lib/definitions";
import { encrypt } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { LogIn } from "lucide-react";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi" })
    .min(2, { message: "Email harus memiliki minimal 2 karakter" })
    .max(255, { message: "Email tidak boleh melebihi 255 karakter" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string({ required_error: "Kata sandi wajib diisi" })
    .min(6, { message: "Kata sandi harus memiliki minimal 6 karakter" })
    .max(100, { message: "Kata sandi tidak boleh melebihi 100 karakter" }),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { setSession } = useSessionStore();
  const { setUser } = useUserStore();

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      const userDoc = await getUserById(user.uid);

      if (!userDoc) {
        toast.error("Pengguna tidak ditemukan");
        throw new Error("Pengguna tidak ditemukan");
      }

      const session: SessionPayload = {
        userId: user.uid,
        nama: userDoc?.nama,
        email: userDoc?.email,
        role: userDoc?.role,
        expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      };

      const encryptedSession = await encrypt(session);
      setSession(encryptedSession);
      setUser({ userId: user.uid, nama: userDoc?.nama, email: userDoc?.email });

      await axios.post("/api/auth/session", {
        session: encryptedSession,
      });

      form.reset();
      toast.success("Berhasil login");
      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Gagal login";
      if (error.response?.status === 401) {
        toast.error("Invalid kredensial login");
      } else {
        toast.error(errorMessage);
      }
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-bold text-2xl">Silahkan Login</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Silahkan masukkan email dan password untuk masuk ke akun Anda.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    {...field}
                    type="password"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full text-white"
            disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingIcon />
                <p>Proses</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogIn />
                <p>Masuk</p>
              </div>
            )}
          </Button>
        </form>
      </Form>

      <div className="text-sm text-center">
        Belum punya akun?{" "}
        <Link href="/register" className="underline underline-offset-4">
          Daftar
        </Link>
      </div>
    </div>
  );
}
