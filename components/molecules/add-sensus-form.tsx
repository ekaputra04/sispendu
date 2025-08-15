"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ISensus } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingIcon from "../atoms/loading-icon";
import { Save } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { createSensus } from "@/lib/firestore/sensus";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  tanggalSensus: z.string().min(2, {
    message: "Tanggal sensus harus diisi dengan format yang valid",
  }),
  lokasi: z
    .string()
    .min(2, { message: "Lokasi harus diisi minimal 2 karakter" }),
  petugas: z
    .string()
    .min(2, { message: "Petugas harus diisi minimal 2 karakter" }),
  keterangan: z.string().min(2, { message: "Keterangan minimal 2 karakter" }),
});

export default function AddSensusForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useUserStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tanggalSensus: "",
      lokasi: "",
      keterangan: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ISensus) => createSensus({ sensus: data }),
    onSuccess: () => {
      toast.success("Berhasil menambahkan data sensus");
      form.reset();

      queryClient.invalidateQueries({ queryKey: ["sensus"] });
      router.push("/dashboard/sensus");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menambahkan data sensus");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data: ISensus = {
      id: crypto.randomUUID(),
      tanggalSensus: values.tanggalSensus,
      lokasi: values.lokasi,
      keterangan: values.keterangan,
      petugas: values.petugas,
    };

    console.log(data);

    mutate(data);
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="tanggalSensus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Sensus</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tanggal Sensus"
                      {...field}
                      type="date"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lokasi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lokasi"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="petugas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Petugas</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Petugas"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Keterangan"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="mt-4 w-full text-white"
            disabled={isPending}>
            {isPending ? (
              <div className="flex items-center gap-2">
                <LoadingIcon />
                <p>Proses</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save />
                Simpan
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
