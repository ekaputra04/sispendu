"use client";

import { Input } from "@/components/ui/input";
import { getKKById } from "@/lib/firestore/kartu-keluarga";
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
import { Copy, Pencil, PlusCircle } from "lucide-react";
import { handleCopy } from "@/lib/utils";
import { ButtonOutlineGreen } from "@/consts/buttonCss";

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
    <div>
      {isLoading && <LoadingView />}
      {data?.data ? (
        <div>
          <div className="flex justify-between items-center">
            <Heading1 text="Detail Kartu Keluarga" />
            <Link href={"/dashboard/kartu-keluarga/edit/" + uuid}>
              <Button variant={"outline"} className={ButtonOutlineGreen}>
                <Pencil />
                Edit Kartu Keluarga
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
                  Nomor Kartu Keluarga
                </TableCell>
                <TableCell>{data?.data?.noKK}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(data?.data?.noKK as string)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
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
        </div>
      ) : (
        <div className="">
          <Heading1 text="Data Detail Penduduk Tidak Ditemukan" />
        </div>
      )}
    </div>
  );
}
