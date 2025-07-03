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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/login", {
        email: values.email,
        password: values.password,
      });

      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        form.reset();
        router.push("/dashboard");
      } else {
        toast.error(data.message);
      }
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingIcon />
                <p>Proses</p>
              </div>
            ) : (
              <p>Masuk</p>
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
