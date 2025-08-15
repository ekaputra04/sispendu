"use client";

import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import LoadingView from "@/components/atoms/loading-view";
import { Button } from "@/components/ui/button";
import { Heading1 } from "@/components/atoms/heading";
import Link from "next/link";
import { Copy, Eye, Pencil } from "lucide-react";
import { calculateAge, handleCopy } from "@/lib/utils";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import Navbar from "@/components/molecules/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getPendudukById } from "@/lib/firestore/penduduk";
import { useEffect, useState } from "react";

interface DetailPendudukPageProps {
  uuid: string;
}

export default function DetailPendudukPage({ uuid }: DetailPendudukPageProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["penduduk", uuid],
    queryFn: () => getPendudukById(uuid),
    retry: false,
  });

  const [age, setAge] = useState("");

  useEffect(() => {
    if (data?.data) {
      const age = calculateAge(data?.data?.tanggalLahir as string);
      setAge(
        age.years + " tahun " + age.months + " bulan" + " " + age.days + " hari"
      );
    }
  }, [data]);

  async function handleCopyData() {
    const pendudukData = `NAMA LENGKAP: ${data?.data?.nama.toUpperCase() || "-"}
Banjar: ${data?.data?.banjar.toUpperCase() || "-"}
JENIS KELAMIN: ${data?.data?.jenisKelamin.toUpperCase() || "-"}
TEMPAT LAHIR: ${data?.data?.tempatLahir.toUpperCase() || "-"}
TANGGAL LAHIR: ${data?.data?.tanggalLahir.toUpperCase() || "-"}
USIA: ${calculateAge(data?.data?.tanggalLahir as string).years} TAHUN
AGAMA: ${data?.data?.agama.toUpperCase() || "-"}
Pendidikan: ${data?.data?.pendidikan.toUpperCase() || "-"}
JENIS PEKERJAAN: ${data?.data?.jenisPekerjaan.toUpperCase() || "-"}
STATUS PERKAWINAN: ${data?.data?.statusPerkawinan.toUpperCase() || "-"}
KEWARGANEGARAAN: ${data?.data?.kewarganegaraan.toUpperCase() || "-"}
GOLONGAN DARAH: ${data?.data?.golonganDarah.toUpperCase() || "-"}
PENYANDANG CACAT: ${data?.data?.penyandangCacat.toUpperCase() || "-"}
NAMA AYAH: ${data?.data?.namaAyah.toUpperCase() || "-"}
NAMA IBU: ${data?.data?.namaIbu.toUpperCase() || "-"}`;

    await handleCopy(pendudukData);
  }

  return (
    <div className="">
      <Navbar />
      <div className="px-8 md:px-16 lg:px-32 py-8 border-green-500 border-b">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/">
                <BreadcrumbPage>Beranda</BreadcrumbPage>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href="/preview">
                <BreadcrumbPage>Preview</BreadcrumbPage>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detail Penduduk</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {isLoading && <LoadingView />}
      {!isLoading && data?.data ? (
        <div className="my-8 px-8 md:px-16 lg:px-32">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Heading1 text="Detail Data Penduduk" />
              <Button variant={"ghost"} onClick={handleCopyData}>
                <Copy />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Link href={"/preview/kartu-keluarga/detail/" + data.data?.kkRef}>
                <Button variant={"outline"}>
                  <Eye />
                  Data Kartu Keluarga
                </Button>
              </Link>
              <Link href={"/preview/penduduk/edit/" + uuid}>
                <Button variant={"outline"} className={ButtonOutlineGreen}>
                  <Pencil />
                  Edit Data Penduduk
                </Button>
              </Link>
            </div>
          </div>
          <hr className="my-4" />
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Nama Lengkap</TableCell>
                <TableCell className="uppercase">{data?.data?.nama}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(data?.data?.nama as string)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jenis Kelamin</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.jenisKelamin}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.jenisKelamin as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tempat Lahir</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.tempatLahir}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.tempatLahir as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tanggal Lahir</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.tanggalLahir}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.tanggalLahir as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Usia</TableCell>
                <TableCell className="uppercase">{age}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(age)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Agama</TableCell>
                <TableCell className="uppercase">{data?.data?.agama}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(data?.data?.agama as string)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Pendidikan</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.pendidikan}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.pendidikan as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jenis Pekerjaan</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.jenisPekerjaan}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.jenisPekerjaan as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Status Perkawinan</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.statusPerkawinan}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.statusPerkawinan as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Kewarganegaraan</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.kewarganegaraan}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.kewarganegaraan as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Golongan Darah</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.golonganDarah}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.golonganDarah as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Penyandang Cacat</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.penyandangCacat}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.penyandangCacat as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nama Ayah</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.namaAyah}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(data?.data?.namaAyah as string)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nama Ibu</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.namaIbu}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(data?.data?.namaIbu as string)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Banjar</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.banjar}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(data?.data?.banjar as string)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="my-8 px-8 md:px-16 lg:px-32">
          <Heading1 text="Data Detail Penduduk Tidak Ditemukan" />
        </div>
      )}
    </div>
  );
}
