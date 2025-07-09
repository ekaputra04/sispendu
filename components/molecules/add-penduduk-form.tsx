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
import { IDataPenduduk } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingIcon from "../atoms/loading-icon";
import { createPenduduk } from "@/lib/firestore/penduduk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Agama,
  Banjar,
  GolonganDarah,
  JenisKelamin,
  JenisPekerjaan,
  Kewarganegaraan,
  Pendidikan,
  PenyandangCacat,
  StatusHubunganDalamKeluarga,
  StatusPerkawinan,
} from "@/consts/dataDefinitions";

const formSchema = z.object({
  nama: z.string().min(2),
  nik: z.string().min(5),
  jenisKelamin: z.enum(["Laki-laki", "Perempuan"]),
  tempatLahir: z.string().min(2),
  tanggalLahir: z.string().min(2),
  agama: z.enum([
    "Islam",
    "Kristen",
    "Katolik",
    "Hindu",
    "Budha",
    "Konghucu",
    "Kepercayaan Terhadap Tuhan YME / Lainnya",
  ]),
  pendidikan: z.string().min(2),
  jenisPekerjaan: z.string().min(2),
  statusPerkawinan: z.enum([
    "Kawin",
    "Belum Kawin",
    "Cerai Hidup",
    "Cerai Mati",
  ]),
  statusHubunganDalamKeluarga: z.enum([
    "Kepala Keluarga",
    "Istri",
    "Suami",
    "Anak",
    "Orang Tua",
    "Mertua",
    "Menantu",
    "Cucu",
    "Pembantu",
    "Famili Lain",
  ]),
  kewarganegaraan: z.enum(["WNI", "WNA"]),
  golonganDarah: z.enum([
    "A",
    "B",
    "AB",
    "O",
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ]),
  penyandangCacat: z.enum([
    "Tidak Cacat",
    "Cacat Fisik",
    "Cacat Netra / Buta",
    "Cacat Rungu / Wicara",
    "Cacat Mental / Jiwa",
    "Cacat Fisik dan Mental",
    "Cacat Lainnya",
  ]),
  banjar: z.enum(["Bebalang", "Tegal", "Sedit", "Gancan", "Sembung", "Petak"]),
  nomorPaspor: z.string().min(2).optional(),
  nomorKitas: z.string().min(2).optional(),
  namaAyah: z.string().min(2),
  namaIbu: z.string().min(2),
});

export default function AddPendudukForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      nik: "",
      tempatLahir: "",
      tanggalLahir: "",
      pendidikan: "",
      jenisPekerjaan: "",
      nomorPaspor: "",
      nomorKitas: "",
      namaAyah: "",
      namaIbu: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: IDataPenduduk) =>
      createPenduduk({ penduduk: data }),
    onSuccess: () => {
      form.reset();

      queryClient.invalidateQueries({ queryKey: ["penduduk"] });

      router.push("/dashboard/penduduk");
      toast.success("Berhasil menambah data penduduk");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menambah data penduduk");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data: IDataPenduduk = {
      id: crypto.randomUUID(),
      nama: values.nama,
      nik: values.nik,
      jenisKelamin: values.jenisKelamin,
      tempatLahir: values.tempatLahir,
      tanggalLahir: values.tanggalLahir,
      agama: values.agama,
      pendidikan: values.pendidikan,
      jenisPekerjaan: values.jenisPekerjaan,
      statusPerkawinan: values.statusPerkawinan,
      statusHubunganDalamKeluarga: values.statusHubunganDalamKeluarga,
      kewarganegaraan: values.kewarganegaraan,
      golonganDarah: values.golonganDarah,
      penyandangCacat: values.penyandangCacat,
      nomorPaspor: values.nomorPaspor,
      nomorKitas: values.nomorKitas,
      namaAyah: values.namaAyah,
      namaIbu: values.namaIbu,
      banjar: values.banjar,
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
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama Lengkap"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIK</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="NIK"
                      {...field}
                      disabled={isPending}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jenisKelamin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Jenis Kelamin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JenisKelamin.map((item) => (
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
            <div className="md:gap-4 space-y-4 md:space-y-0 grid grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="tempatLahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempat Lahir</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tempat Lahir"
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
                name="tanggalLahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tanggal Lahir"
                        {...field}
                        disabled={isPending}
                        type="date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="agama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agama</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Agama" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Agama.map((item) => (
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
            <FormField
              control={form.control}
              name="pendidikan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pendidikan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pendidikan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Pendidikan.map((item) => (
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
            <FormField
              control={form.control}
              name="jenisPekerjaan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Pekerjaan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Jenis Pekerjaan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JenisPekerjaan.map((item) => (
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
            <FormField
              control={form.control}
              name="statusPerkawinan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Perkawinan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status Perkawinan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {StatusPerkawinan.map((item) => (
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
            <FormField
              control={form.control}
              name="statusHubunganDalamKeluarga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Hubungan dalam Keluarga</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status Hubungan dalam Keluarga" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {StatusHubunganDalamKeluarga.map((item) => (
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
            <FormField
              control={form.control}
              name="kewarganegaraan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kewarganegaraan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Kewarganegaraan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Kewarganegaraan.map((item) => (
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
            <FormField
              control={form.control}
              name="golonganDarah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Golongan Darah</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Golongan Darah" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GolonganDarah.map((item) => (
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
            <FormField
              control={form.control}
              name="penyandangCacat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Penyandang Cacat</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Penyandang Cacat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PenyandangCacat.map((item) => (
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
            <FormField
              control={form.control}
              name="nomorPaspor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Paspor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nomor Paspor"
                      {...field}
                      disabled={isPending}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nomorKitas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Kitas</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nomor Kitas"
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
              name="namaAyah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ayah</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama Ayah"
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
              name="namaIbu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ibu</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama Ibu"
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
              <p>Simpan</p>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
