"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IDataPenduduk } from "@/types/types";
import Link from "next/link";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import { usePendudukSelectedForDelete } from "@/store/usePendudukSelectedForDelete";

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
    accessorKey: "agama",
    header: "Agama",
  },
  {
    accessorKey: "banjar",
    header: "Banjar",
  },
  {
    accessorKey: "statusPerkawinan",
    header: "Status Perkawinan",
  },
  {
    accessorKey: "jenisPekerjaan",
    header: "Pekerjaan",
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
          <Link href={`/dashboard/penduduk/detail/${penduduk.id}`}>
            <Button size={"sm"} variant={"outline"}>
              <Eye />
            </Button>
          </Link>
          <Link href={`/dashboard/penduduk/edit/${penduduk.id}`}>
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
