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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingIcon from "../atoms/loading-icon";
import { getKKById, updateKK } from "@/lib/firestore/kartu-keluarga";
import { useEffect } from "react";
import LoadingView from "../atoms/loading-view";

const formSchema = z.object({
  noKK: z.string().min(2),
  namaKepalaKeluarga: z.string().min(2),
  alamat: z.string().min(2),
  rt: z.string().optional(),
  rw: z.string().optional(),
  desa: z.string().min(2),
  kecamatan: z.string().min(2),
  kabupaten: z.string().min(2),
  provinsi: z.string().min(2),
  kodePos: z.string().min(2),
  tanggalPenerbitan: z.string().min(2),
});

interface AddEditFormProps {
  uuid: string;
}

export default function EditKKForm({ uuid }: AddEditFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["kartu-keluarga", uuid],
    queryFn: () => getKKById(uuid),
    retry: false,
  });

  useEffect(() => {
    console.log(data);

    const dataResult = data?.data;
    form.setValue("noKK", dataResult?.noKK || "");
    form.setValue("namaKepalaKeluarga", dataResult?.namaKepalaKeluarga || "");
    form.setValue("alamat", dataResult?.alamat || "");
    form.setValue("rt", dataResult?.rt || "");
    form.setValue("rw", dataResult?.rw || "");
    form.setValue("desa", dataResult?.desa || "");
    form.setValue("kecamatan", dataResult?.kecamatan || "");
    form.setValue("kabupaten", dataResult?.kabupaten || "");
    form.setValue("provinsi", dataResult?.provinsi || "");
    form.setValue("kodePos", dataResult?.kodePos || "");
    form.setValue("tanggalPenerbitan", dataResult?.tanggalPenerbitan || "");
  }, [data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      noKK: "",
      namaKepalaKeluarga: "",
      alamat: "",
      rt: "",
      rw: "",
      desa: "",
      kecamatan: "",
      kabupaten: "",
      provinsi: "",
      kodePos: "",
      tanggalPenerbitan: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: IKartuKeluarga) => updateKK(uuid, data),
    onSuccess: () => {
      toast.success("Berhasil menambahkan data kartu keluarga");
      form.reset();

      queryClient.invalidateQueries({ queryKey: ["kartu-keluarga"] });
      router.push("/dashboard/kartu-keluarga");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menambahkan data kartu keluarga");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data: IKartuKeluarga = {
      id: uuid,
      noKK: values.noKK,
      namaKepalaKeluarga: values.namaKepalaKeluarga,
      alamat: values.alamat,
      rt: values.rt,
      rw: values.rw,
      desa: values.desa,
      kecamatan: values.kecamatan,
      kabupaten: values.kabupaten,
      provinsi: values.provinsi,
      kodePos: values.kodePos,
      tanggalPenerbitan: values.tanggalPenerbitan,
    };
    mutate(data);
  }

  return (
    <div className="">
      {isLoading && <LoadingView />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="noKK"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor KK</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nomor KK"
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
              name="namaKepalaKeluarga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kepala Keluarga</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nomor KK"
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
            <div className="gap-4 grid grid-cols-2">
              <FormField
                control={form.control}
                name="rt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RT</FormLabel>
                    <FormControl>
                      <Input placeholder="RT" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RW</FormLabel>
                    <FormControl>
                      <Input placeholder="RW" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="desa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desa</FormLabel>
                  <FormControl>
                    <Input placeholder="Desa" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kecamatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecamatan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kecamatan"
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
              name="kabupaten"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kabupaten</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kabupaten"
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
              name="provinsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinsi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Provinsi"
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
              name="kodePos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Pos</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kode Pos"
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
          </div>

          <Button type="submit" className="mt-4 w-full" disabled={isPending}>
            {isPending ? (
              <div className="flex items-center gap-2">
                <LoadingIcon />
                <p>Proses</p>
              </div>
            ) : (
              <p>Simpan</p>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
