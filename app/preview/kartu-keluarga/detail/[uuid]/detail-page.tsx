"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingView from "@/components/atoms/loading-view";
import { Button } from "@/components/ui/button";
import { Heading1, Heading2 } from "@/components/atoms/heading";
import Link from "next/link";
import { Copy, Eye, Pencil } from "lucide-react";
import DialogDeleteUserFromKK from "../../../../../components/molecules/dialog-delete-user-from-kk";
import {
  calculateAge,
  capitalizeWords,
  formatWitaDate,
  handleCopy,
} from "@/lib/utils";
import { getKKById } from "@/lib/firestore/kartu-keluarga";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import SheetAddPendudukToKK from "@/components/molecules/sheet-add-penduduk-to-kk";
import { IAnggotaKeluarga, IDataPenduduk } from "@/types/types";
import { StatusHubunganDalamKeluarga } from "@/consts/dataDefinitions";
import Navbar from "@/components/molecules/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DialogEditStatusHubungan from "@/components/molecules/dialog-edit-status-hubungan";

interface DetailKartuKeluargaPageProps {
  uuid: string;
}

export default function DetailKartuKeluargaPage({
  uuid,
}: DetailKartuKeluargaPageProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["kartu-keluarga", uuid],
    queryFn: () => getKKById(uuid),
    retry: false,
  });

  async function handleCopyData() {
    const kkData = `NAMA KEPALA KELUARGA: ${
      data?.data?.namaKepalaKeluarga?.toUpperCase() || "-"
    }
  ALAMAT: ${data?.data?.alamat?.toUpperCase() || "-"}
  BANJAR: ${data?.data?.banjar?.toUpperCase() || "-"}
  TERAKHIR DIPERBARUI: ${
    formatWitaDate(data?.data?.updatedAt)?.toUpperCase() || "-"
  }
  =============\n\n`;

    let anggotaData = "";

    data?.data?.anggota
      ?.slice()
      .sort((a: IAnggotaKeluarga, b: IAnggotaKeluarga) => {
        const indexA = StatusHubunganDalamKeluarga.indexOf(
          a.statusHubunganDalamKeluarga
        );
        const indexB = StatusHubunganDalamKeluarga.indexOf(
          b.statusHubunganDalamKeluarga
        );

        if (indexA !== indexB) {
          return indexA - indexB;
        }

        const dateA = new Date(a.detail?.tanggalLahir || "");
        const dateB = new Date(b.detail?.tanggalLahir || "");
        return dateA.getTime() - dateB.getTime();
      })
      .forEach((anggota: IAnggotaKeluarga) => {
        anggotaData += `STATUS HUBUNGAN DALAM KELUARGA: ${
          anggota.statusHubunganDalamKeluarga?.toUpperCase() || "-"
        }
  NAMA LENGKAP: ${anggota?.detail?.nama?.toUpperCase() || "-"}
  BANJAR: ${anggota?.detail?.banjar?.toUpperCase() || "-"}
  TEMPAT LAHIR: ${anggota?.detail?.tempatLahir?.toUpperCase() || "-"}
  TANGGAL LAHIR: ${anggota?.detail?.tanggalLahir?.toUpperCase() || "-"}
  USIA: ${calculateAge(anggota?.detail?.tanggalLahir as string).years} TAHUN
  AGAMA: ${anggota?.detail?.agama?.toUpperCase() || "-"}
  PENDIDIKAN: ${anggota?.detail?.pendidikan?.toUpperCase() || "-"}
  JENIS PEKERJAAN: ${anggota?.detail?.jenisPekerjaan?.toUpperCase() || "-"}
  STATUS PERKAWINAN: ${anggota?.detail?.statusPerkawinan?.toUpperCase() || "-"}
  KEWARGANEGARAAN: ${anggota?.detail?.kewarganegaraan?.toUpperCase() || "-"}
  GOLONGAN DARAH: ${anggota?.detail?.golonganDarah?.toUpperCase() || "-"}
  PENYANDANG CACAT: ${anggota?.detail?.penyandangCacat?.toUpperCase() || "-"}
  NAMA AYAH: ${anggota?.detail?.namaAyah?.toUpperCase() || "-"}
  NAMA IBU: ${anggota?.detail?.namaIbu?.toUpperCase() || "-"}\n
  -------------\n`;
      });

    const finalKKData = kkData + anggotaData;

    await handleCopy(finalKKData);
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
              <BreadcrumbPage className="font-semibold">
                Detail Kartu Keluarga
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {isLoading && <LoadingView />}
      {error && <p className="text-red-500 text-sm">Error: {error.message}</p>}
      {!isLoading && data?.data ? (
        <div className="my-8 px-8 md:px-16 lg:px-32">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Heading1 text="Detail Data Kartu Keluarga" />
              <Button variant={"ghost"} onClick={handleCopyData}>
                <Copy />
              </Button>
            </div>
            <Link href={"/preview/kartu-keluarga/edit/" + uuid}>
              <Button variant={"outline"} className={ButtonOutlineGreen}>
                <Pencil />
                Edit Data Kartu Keluarga
              </Button>
            </Link>
          </div>
          <hr className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Atribut</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  Nama Kepala Keluarga
                </TableCell>
                <TableCell>
                  {data?.data?.namaKepalaKeluarga.toUpperCase()}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(
                        data?.data?.namaKepalaKeluarga.toUpperCase() as string
                      )
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Alamat</TableCell>
                <TableCell>{data?.data?.alamat.toUpperCase()}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.alamat.toUpperCase() as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Banjar</TableCell>
                <TableCell>{data?.data?.banjar.toUpperCase()}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.banjar.toUpperCase() as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Tanggal Penerbitan
                </TableCell>
                <TableCell>{data?.data?.tanggalPenerbitan}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.tanggalPenerbitan as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Terakhir Diperbarui
                </TableCell>
                <TableCell>{formatWitaDate(data?.data?.updatedAt)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <hr className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Heading2 text="Daftar Anggota Keluarga" />
              <SheetAddPendudukToKK kkId={uuid} />
            </div>
            <Table>
              <TableCaption>
                {data.data?.anggota?.length == 0
                  ? "Belum ada anggota keluarga"
                  : "Daftar Anggota Keluarga"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Status Hubungan Keluarga</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Tanggal Lahir</TableHead>
                  <TableHead>Usia</TableHead>
                  <TableHead>Nama Ayah</TableHead>
                  <TableHead>Nama Ibu</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.anggota
                  ?.slice()
                  .sort((a: IAnggotaKeluarga, b: IAnggotaKeluarga) => {
                    const indexA = StatusHubunganDalamKeluarga.indexOf(
                      a.statusHubunganDalamKeluarga
                    );
                    const indexB = StatusHubunganDalamKeluarga.indexOf(
                      b.statusHubunganDalamKeluarga
                    );

                    if (indexA !== indexB) {
                      return indexA - indexB;
                    }

                    const dateA = new Date(a.detail?.tanggalLahir || "");
                    const dateB = new Date(b.detail?.tanggalLahir || "");
                    return dateA.getTime() - dateB.getTime();
                  })
                  .map((penduduk: IAnggotaKeluarga, index: number) => {
                    const pendudukDetail: IDataPenduduk = penduduk.detail!;

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="flex justify-between items-center uppercase">
                          <span>{penduduk.statusHubunganDalamKeluarga}</span>

                          <DialogEditStatusHubungan
                            penduduk={pendudukDetail}
                            statusHubunganDalamKeluarga={
                              penduduk.statusHubunganDalamKeluarga
                            }
                          />
                        </TableCell>
                        <TableCell className="uppercase">
                          {pendudukDetail.nama}
                        </TableCell>
                        <TableCell className="uppercase">
                          {pendudukDetail.jenisKelamin}
                        </TableCell>
                        <TableCell className="uppercase">
                          {pendudukDetail.tanggalLahir}
                        </TableCell>
                        <TableCell className="uppercase">
                          {calculateAge(pendudukDetail.tanggalLahir).years || 0}
                        </TableCell>
                        <TableCell className="uppercase">
                          {pendudukDetail.namaAyah}
                        </TableCell>
                        <TableCell className="uppercase">
                          {pendudukDetail.namaIbu}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Link
                            href={`/preview/penduduk/detail/${pendudukDetail.id}`}>
                            <Button variant={"outline"}>
                              <Eye />
                            </Button>
                          </Link>
                          <Link
                            href={`/preview/penduduk/edit/${pendudukDetail.id}`}>
                            <Button variant={"outline"}>
                              <Pencil />
                            </Button>
                          </Link>
                          <DialogDeleteUserFromKK
                            kkId={uuid}
                            pendudukId={penduduk.pendudukId}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="my-8 px-8 md:px-16 lg:px-32">
          <Heading1 text="Data Detail Kartu Keluarga Tidak Ditemukan" />
        </div>
      )}
    </div>
  );
}
