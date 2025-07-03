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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase-init";
import { toast } from "sonner";
import { useState } from "react";
import LoadingIcon from "../atoms/loading-icon";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().min(2).max(255).email(),
  password: z.string().min(6).max(100),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("user created:", user);
        toast.success("Berhasil login");
        form.reset();
        router.push("/dashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error login user:", errorCode, errorMessage);
        if (errorCode == "auth/invalid-credential") {
          toast.error("Email atau password salah");
        }
        toast.error("Gagal login");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
        Belum punya akun?{" "}
        <Link href="/register" className="underline underline-offset-4">
          Daftar
        </Link>
      </div>
    </div>
  );
}
