"use client";

import { Input } from "@/components/ui/input";
import { getKKById } from "@/lib/kk";
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
import { Heading2 } from "@/components/atoms/heading";
import Link from "next/link";
import { Copy, Pencil, PlusCircle } from "lucide-react";
import DialogDeleteUserFromKK from "./dialog-delete-user-from-kk";
import { handleCopy } from "@/lib/utils";

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
      {isLoading && <LoadingView />}
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
            <TableCell className="font-medium">Nomor Kartu Keluarga</TableCell>
            <TableCell>{data?.noKK}</TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() => handleCopy(data?.noKK as string)}>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Nama Kepala Keluarga</TableCell>
            <TableCell>{data?.namaKepalaKeluarga}</TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() => handleCopy(data?.namaKepalaKeluarga as string)}>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Alamat</TableCell>
            <TableCell>{data?.alamat}</TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() => handleCopy(data?.alamat as string)}>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Tanggal Penerbitan</TableCell>
            <TableCell>{data?.tanggalPenerbitan}</TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() => handleCopy(data?.tanggalPenerbitan as string)}>
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
          <Button>
            <PlusCircle />
            Tambah Anggota Keluarga
          </Button>
        </div>
        <Table>
          <TableCaption>Daftar Anggota Keluarga</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>NIK</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
              <TableHead>Hubungan Keluarga</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">1</TableCell>
              <TableCell>Nik</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Laki-laki</TableCell>
              <TableCell>Kepala Keluarga</TableCell>
              <TableCell className="flex gap-2">
                <Link href={"/"}>
                  <Button variant={"outline"}>
                    <Pencil />
                    Edit
                  </Button>
                </Link>
                <DialogDeleteUserFromKK />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
