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
import { Pencil } from "lucide-react";
import DialogDeleteUserFromKK from "./dialog-delete-user-from-kk";

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
      <div className="space-y-2">
        <div className="grid grid-cols-3">
          <p>No Kartu Keluarga</p>
          <Input
            disabled
            value={data?.noKK || ""}
            className="col-span-2 w-full"
          />
        </div>
        <div className="grid grid-cols-3">
          <p>Kepala Keluarga</p>
          <Input
            disabled
            value={data?.namaKepalaKeluarga || ""}
            className="col-span-2 w-full"
          />
        </div>
        <div className="grid grid-cols-3">
          <p>Alamat</p>
          <Input
            disabled
            value={data?.alamat || ""}
            className="col-span-2 w-full"
          />
        </div>
      </div>
      <hr className="my-4" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Heading2 text="Daftar Anggota Keluarga" />
          <Button>Tambah Anggota Keluarga</Button>
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
              <TableCell>
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
