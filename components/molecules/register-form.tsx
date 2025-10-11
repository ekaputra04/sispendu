"use client";

import axios from 'axios';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { auth, db } from '@/config/firebase-init';
import { SessionPayload } from '@/lib/definitions';
import { encrypt } from '@/lib/utils';
import { useSessionStore } from '@/store/useSession';
import { useUserStore } from '@/store/useUserStore';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingIcon from '../atoms/loading-icon';

const formSchema = z
  .object({
    name: z
      .string({ required_error: "Nama wajib diisi" })
      .min(2, { message: "Nama harus memiliki minimal 2 karakter" })
      .max(255, { message: "Nama tidak boleh melebihi 255 karakter" }),
    email: z
      .string({ required_error: "Email wajib diisi" })
      .min(2, { message: "Email harus memiliki minimal 2 karakter" })
      .max(255, { message: "Email tidak boleh melebihi 255 karakter" })
      .email({ message: "Format email tidak valid" }),
    password: z
      .string({ required_error: "Kata sandi wajib diisi" })
      .min(6, { message: "Kata sandi harus memiliki minimal 6 karakter" })
      .max(100, { message: "Kata sandi tidak boleh melebihi 100 karakter" }),
    passwordConfirm: z
      .string({ required_error: "Konfirmasi kata sandi wajib diisi" })
      .min(6, {
        message: "Konfirmasi kata sandi harus memiliki minimal 6 karakter",
      })
      .max(100, {
        message: "Konfirmasi kata sandi tidak boleh melebihi 100 karakter",
      }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Konfirmasi kata sandi tidak cocok dengan kata sandi",
    path: ["passwordConfirm"],
  });

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserStore();
  const { setSession } = useSessionStore();

  const defaultRole = "petugas";

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
        role: defaultRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const session: SessionPayload = {
        userId: user.uid,
        nama: values.name,
        email: values.email,
        role: defaultRole,
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
                <p>Daftar</p>
              </div>
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
