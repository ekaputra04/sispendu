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
import { IKartuKeluarga } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingIcon from "../atoms/loading-icon";
import { createKK } from "@/lib/firestore/kartu-keluarga";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Banjar } from "@/consts/dataDefinitions";
import { Save } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

const formSchema = z.object({
  namaKepalaKeluarga: z.string().min(2),
  alamat: z.string().min(2),
  banjar: z.enum(["Bebalang", "Tegal", "Sedit", "Gancan", "Sembung", "Petak"]),
  tanggalPenerbitan: z.string().min(2),
});

interface AddKKFormProps {
  redirectTo?: "preview" | "dashboard";
}

export default function AddKKForm({
  redirectTo = "dashboard",
}: AddKKFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useUserStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      namaKepalaKeluarga: "",
      alamat: "",
      tanggalPenerbitan: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: IKartuKeluarga) => createKK({ kk: data }),
    onSuccess: () => {
      toast.success("Berhasil menambahkan data kartu keluarga");
      form.reset();

      queryClient.invalidateQueries({ queryKey: ["kartu-keluarga"] });
      router.push(
        redirectTo === "dashboard" ? "/dashboard/kartu-keluarga" : "/preview"
      );
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menambahkan data kartu keluarga");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data: IKartuKeluarga = {
      id: crypto.randomUUID(),
      namaKepalaKeluarga: values.namaKepalaKeluarga,
      alamat: values.alamat,
      banjar: values.banjar,
      tanggalPenerbitan: values.tanggalPenerbitan,
      createdBy: user.email,
    };
    mutate(data);
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="namaKepalaKeluarga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kepala Keluarga</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama Kepala Keluarga"
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
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Alamat"
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
              name="tanggalPenerbitan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Penerbitan</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="banjar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banjar</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Banjar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Banjar.map((item) => (
                        <SelectItem value={item} key={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="mt-4 w-full" disabled={isPending}>
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
