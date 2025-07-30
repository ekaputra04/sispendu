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
import { useUserStore } from "@/store/useUserStore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/config/firebase-init";
import { doc, setDoc } from "firebase/firestore";
import { SessionPayload } from "@/lib/definitions";
import { encrypt } from "@/lib/utils";
import { useSessionStore } from "@/store/useSession";

const formSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().min(2).max(255).email(),
  password: z.string().min(6).max(100),
  passwordConfirm: z.string().min(6).max(100),
});

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserStore();
  const { setSession } = useSessionStore();

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (values.password !== values.passwordConfirm) {
        toast.error("Password dan konfirmasi password tidak sama");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        nama: values.name,
        email: values.email,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const session: SessionPayload = {
        userId: user.uid,
        nama: values.name,
        email: values.email,
        role: "user",
        expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      };

      const encryptedSession = await encrypt(session);
      setSession(encryptedSession);
      setUser({ userId: user.uid, nama: values.name, email: values.email });

      await axios.post("/api/auth/session", {
        session: encryptedSession,
      });

      form.reset();
      toast.success("Berhasil login");
      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Gagal membuat akun";
      if (
        error.response?.status === 400 &&
        errorMessage.includes("Email sudah terdaftar")
      ) {
        toast.error("Email sudah terdaftar");
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
        <h1 className="font-bold text-2xl">Silahkan Buat Akun</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Masukkan data Anda di bawah ini untuk membuat akun baru
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nama Lengkap"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konfirmasi Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Konfirmasi Password"
                    {...field}
                    type="password"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingIcon />
                <p>Proses</p>
              </div>
            ) : (
              <p>Daftar</p>
            )}
          </Button>
        </form>
      </Form>

      <div className="text-sm text-center">
        Sudah punya akun?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Masuk
        </Link>
      </div>
    </div>
  );
}
