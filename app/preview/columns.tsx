"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IDataPenduduk } from "@/types/types";
import Link from "next/link";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import { usePendudukSelectedForDelete } from "@/store/usePendudukSelectedForDelete";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<IDataPenduduk>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },

  {
    accessorKey: "nama",
    header: "Nama Lengkap",
  },

  {
    accessorKey: "tanggalLahir",
    header: "Tanggal Lahir",
  },
  {
    accessorKey: "banjar",
    header: "Banjar",
  },
  {
    accessorKey: "jenisPekerjaan",
    header: "Pekerjaan",
  },
  {
    accessorKey: "namaAyah",
    header: "Nama Ayah",
  },
  {
    accessorKey: "namaIbu",
    header: "Nama Ibu",
  },
  {
    accessorKey: "kkRef",
    header: "Terdaftar di KK",
    cell: ({ row }) => {
      const penduduk: IDataPenduduk = row.original;

      return (
        <Badge variant={penduduk.kkRef ? "default" : "destructive"}>
          {penduduk.kkRef ? (
            <Link href={`/preview/kartu-keluarga/detail/${penduduk.kkRef}`}>
              <div className="flex items-center gap-2 text-white">
                <p>Ya</p>
                <Eye className="w-4 h-4" />
              </div>
            </Link>
          ) : (
            "Tidak"
          )}
        </Badge>
      );
    },
  },
  {
    id: "Aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const penduduk: IDataPenduduk = row.original;
      const { setPenduduk, setIsOpen } = usePendudukSelectedForDelete();

      async function handleOpenDialog() {
        setPenduduk(penduduk);
        setIsOpen(true);
      }

      return (
        <div className="flex gap-2">
          <Link href={`/preview/penduduk/detail/${penduduk.id}`}>
            <Button size={"sm"} variant={"outline"}>
              <Eye />
            </Button>
          </Link>
          <Link href={`/preview/penduduk/edit/${penduduk.id}`}>
            <Button
              size={"sm"}
              variant={"outline"}
              className={ButtonOutlineGreen}>
              <Pencil />
            </Button>
          </Link>
          <Button
            size={"sm"}
            variant={"destructive"}
            onClick={handleOpenDialog}>
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
