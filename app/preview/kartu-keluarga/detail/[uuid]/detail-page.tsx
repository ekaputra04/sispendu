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
import { handleCopy } from "@/lib/utils";
import { getKKById } from "@/lib/firestore/kartu-keluarga";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import SheetAddPendudukToKK from "@/components/molecules/sheet-add-penduduk-to-kk";
import { IAnggotaKeluarga, IDataPenduduk } from "@/types/types";
import { StatusHubunganDalamKeluarga } from "@/consts/dataDefinitions";
import Navbar from "@/components/molecules/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

  return (
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
              <BreadcrumbLink href="/preview">Preview</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detail Kartu Keluarga</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {isLoading && <LoadingView />}
      {!isLoading && data?.data ? (
        <div className="my-8 px-8 md:px-16 lg:px-32">
          <div className="flex justify-between items-center">
            <Heading1 text="Detail Data Kartu Keluarga" />
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
                <TableCell>{data?.data?.namaKepalaKeluarga}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.namaKepalaKeluarga as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Alamat</TableCell>
                <TableCell>{data?.data?.alamat}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(data?.data?.alamat as string)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Banjar</TableCell>
                <TableCell>{data?.data?.banjar}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(data?.data?.banjar as string)}>
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
                    return indexA - indexB;
                  })
                  .map((penduduk: IAnggotaKeluarga, index: number) => {
                    const pendudukDetail: IDataPenduduk = penduduk.detail!;

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          {penduduk.statusHubunganDalamKeluarga}
                        </TableCell>
                        <TableCell>{pendudukDetail.nama}</TableCell>
                        <TableCell>{pendudukDetail.jenisKelamin}</TableCell>
                        <TableCell className="flex gap-2">
                          <Link
                            href={`/dashboard/penduduk/detail/${pendudukDetail.id}`}>
                            <Button variant={"outline"}>
                              <Eye />
                            </Button>
                          </Link>
                          <Link
                            href={`/dashboard/penduduk/edit/${pendudukDetail.id}`}>
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
