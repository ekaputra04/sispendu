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
import { IDataPenduduk, IKartuKeluarga } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingIcon from "../atoms/loading-icon";
import { createKK } from "@/lib/kk";
import { createPenduduk } from "@/lib/penduduk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  nama: z.string().min(2),
  nik: z.string().min(5),
  jenisKelamin: z.enum(["Laki-laki", "Perempuan"]),
  tempatLahir: z.string().min(2),
  tanggalLahir: z.string().min(2),
  agama: z.string().min(2),
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
    "Famili Lain",
  ]),
  kewarganegaraan: z.enum(["WNI", "WNA"]),
  nomorPaspor: z.string().min(2).optional(),
  nomorKitas: z.string().min(2).optional(),
  namaAyah: z.string().min(2).optional(),
  namaIbu: z.string().min(2).optional(),
  kartuKeluargaRef: z.string().min(2).optional(),
  ayahRef: z.string().min(2).optional(),
  ibuRef: z.string().min(2).optional(),
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
      agama: "",
      pendidikan: "",
      jenisPekerjaan: "",
      nomorPaspor: "",
      nomorKitas: "",
      namaAyah: "",
      namaIbu: "",
      kartuKeluargaRef: "",
      ayahRef: "",
      ibuRef: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: IDataPenduduk) =>
      createPenduduk({ penduduk: data }),
    onSuccess: () => {
      toast.success("Berhasil membuat kartu keluarga");
      form.reset();

      queryClient.invalidateQueries({ queryKey: ["kartu-keluarga"] });

      router.push("/dashboard/kartu-keluarga");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal membuat kartu keluarga");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Berhasil membuat penduduk");

    // const data: IDataPenduduk = {
    //   id: crypto.randomUUID(),
    //   nama: values.nama,
    //   nik: values.nik,
    //   jenisKelamin: values.jenisKelamin,
    //   tempatLahir: values.tempatLahir,
    //   tanggalLahir: values.tanggalLahir,
    //   agama: values.agama,
    //   pendidikan: values.pendidikan,
    //   jenisPekerjaan: values.jenisPekerjaan,
    //   statusPerkawinan: values.statusPerkawinan,
    //   statusHubunganDalamKeluarga: values.statusHubunganDalamKeluarga,
    //   nomorPaspor: values.nomorPaspor,
    //   nomorKitas: values.nomorKitas,
    //   namaAyah: values.namaAyah,
    //   namaIbu: values.namaIbu,
    //   kartuKeluargaRef: values.kartuKeluargaRef,
    //   ayahRef: values.ayahRef,
    //   ibuRef: values.ibuRef,
    // };
    // mutate(data);
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
              name="nik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIK</FormLabel>
                  <FormControl>
                    <Input placeholder="NIK" {...field} disabled={isPending} />
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
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Jenis Kelamin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:gap-4 grid grid-cols-1 md:grid-cols-2">
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
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Agama" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Islam">Islam</SelectItem>
                      <SelectItem value="Budha">Budha</SelectItem>
                      <SelectItem value="Kristen Katolik">
                        Kristen Katolik
                      </SelectItem>
                      <SelectItem value="Kristen Protestan">
                        Kristen Protestan
                      </SelectItem>
                      <SelectItem value="Konghucu">Konghucu</SelectItem>
                      <SelectItem value="Kepercayaan Terhadap Tuhan YME / Lainnya">
                        Kepercayaan Terhadap Tuhan YME / Lainnya
                      </SelectItem>
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
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pendidikan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Tidak / Belum Sekolah">
                        Tidak / Belum Sekolah
                      </SelectItem>
                      <SelectItem value="Belum Tamat SD / Sederajat">
                        Belum Tamat SD / Sederajat
                      </SelectItem>
                      <SelectItem value="Tamat SD / Sederajat">
                        Tamat SD / Sederajat
                      </SelectItem>
                      <SelectItem value="SLTP / Sederajat">
                        SLTP / Sederajat
                      </SelectItem>
                      <SelectItem value="SLTA / Sederajat">
                        SLTA / Sederajat
                      </SelectItem>
                      <SelectItem value="Diploma I / II">
                        Diploma I / II
                      </SelectItem>
                      <SelectItem value="Akademi / Diploma III / S. Muda">
                        Akademi / Diploma III / S. Muda
                      </SelectItem>
                      <SelectItem value="Diploma IV / Strata I">
                        Diploma IV / Strata I
                      </SelectItem>
                      <SelectItem value="Strata II">Strata II</SelectItem>
                      <SelectItem value="Strata III">Strata III</SelectItem>
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
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Jenis Pekerjaan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Belum / Tidak Bekerja">
                        Belum / Tidak Bekerja
                      </SelectItem>
                      <SelectItem value="Buruh Harian Lepas">
                        Buruh Harian Lepas
                      </SelectItem>
                      <SelectItem value="Buruh Tani / Perkebunan">
                        Buruh Tani / Perkebunan
                      </SelectItem>
                      <SelectItem value="Guru">Guru</SelectItem>
                      <SelectItem value="Karyawan Swasta">
                        Karyawan Swasta
                      </SelectItem>
                      <SelectItem value="Kepolisian RI (POLRI)">
                        Kepolisian RI (POLRI)
                      </SelectItem>
                      <SelectItem value="Mengurus Rumah Tangga">
                        Mengurus Rumah Tangga
                      </SelectItem>
                      <SelectItem value="Pedagang">Pedagang</SelectItem>
                      <SelectItem value="Pegawai Negeri Sipil (PNS)">
                        Pegawai Negeri Sipil (PNS)
                      </SelectItem>
                      <SelectItem value="Pelajar / Mahasiswa">
                        Pelajar / Mahasiswa
                      </SelectItem>
                      <SelectItem value="Pensiunan">Pensiunan</SelectItem>
                      <SelectItem value="Perangkat Desa">
                        Perangkat Desa
                      </SelectItem>
                      <SelectItem value="Perdagangan">Perdagangan</SelectItem>
                      <SelectItem value="Petani / Pekebun">
                        Petani / Pekebun
                      </SelectItem>
                      <SelectItem value="Wiraswasta">Wiraswasta</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
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
                  <FormLabel>Jenis Pekerjaan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Jenis Pekerjaan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Belum Kawin">Belum Kawin</SelectItem>
                      <SelectItem value="Kawin">Kawin</SelectItem>
                      <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
                      <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
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
                  <FormLabel>Jenis Pekerjaan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Jenis Pekerjaan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Kepala Keluarga">
                        Kepala Keluarga
                      </SelectItem>
                      <SelectItem value="Suami">Suami</SelectItem>
                      <SelectItem value="Istri">Istri</SelectItem>
                      <SelectItem value="Anak">Anak</SelectItem>
                      <SelectItem value="Orang Tua">Orang Tua</SelectItem>
                      <SelectItem value="Mertua">Mertua</SelectItem>
                      <SelectItem value="Menantu">Menantu</SelectItem>
                      <SelectItem value="Cucu">Cucu</SelectItem>
                      <SelectItem value="Pembantu">Pembantu</SelectItem>
                      <SelectItem value="Famili Lain">Famili Lain</SelectItem>
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
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Kewarganegaraan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="WNI">WNI</SelectItem>
                      <SelectItem value="WNA">WNA</SelectItem>
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
