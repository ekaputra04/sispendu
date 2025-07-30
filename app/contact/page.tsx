"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Footer from "@/components/atoms/footer";
import Navbar from "@/components/molecules/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createContact } from "@/lib/firestore/contact";
import { toast } from "sonner";
import { useState } from "react";
import LoadingIcon from "@/components/atoms/loading-icon";

const formSchema = z.object({
  nama: z.string().min(2, { message: "Nama harus diisi minimal 2 karakter" }),
  email: z
    .string()
    .email({ message: "Email harus diisi dengan format yang valid" }),
  pesan: z.string().min(5, { message: "Pesan harus diisi minimal 5 karakter" }),
});

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      email: "",
      pesan: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values);
      const response = await createContact(values);
      console.log(response);
      if (response.success) {
        toast.success("Pesan berhasil dikirim!");
        form.reset();
      } else {
        toast.error("Gagal mengirim pesan");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Terjadi kesalahan saat mengirim pesan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="">
        <Navbar />
        <div className="px-8 md:px-16 lg:px-32 py-8 border-green-500 border-b">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Kontak</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div>
        <div className="mx-auto px-8 md:px-16 lg:px-32 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-bold text-gray-900 text-3xl md:text-4xl">
              Hubungi Kami
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 text-lg">
              Silakan hubungi kami melalui informasi di bawah ini atau kirim
              pesan melalui form kontak.
            </p>
          </div>

          {/* Informasi Kontak dan Form */}
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-12">
            {/* Informasi Kontak */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-semibold text-lg">
                  Informasi Kontak
                </CardTitle>
                <CardDescription>
                  Hubungi kami untuk pertanyaan atau bantuan terkait Sistem Data
                  Kependudukan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <p>Jl. Bebalang No. 1, Kelurahan Bebalang, Bali</p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <a
                    href="mailto:info@bebalang.desa.id"
                    className="hover:text-blue-600 transition-colors">
                    info@bebalang.desa.id
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-5 h-5" />
                  <a
                    href="tel:+621234567890"
                    className="hover:text-blue-600 transition-colors">
                    +62 123 456 7890
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Form Kontak */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-semibold text-lg">
                  Kirim Pesan
                </CardTitle>
                <CardDescription>
                  Isi form berikut untuk mengirim pertanyaan atau saran kepada
                  kami.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nama"
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
                            <Input
                              placeholder="Email"
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
                      name="pesan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pesan</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Pesan"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <LoadingIcon />
                          <p>Mengirim...</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send />
                          <p>Kirim</p>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
