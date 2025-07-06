"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IKartuKeluarga } from "@/types/types";
import Link from "next/link";
import DialogDeleteKK from "./dialog-delete-kk";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import { useKKSelectedForDelete } from "@/store/useKKSelectedForDelete";

export const columns: ColumnDef<IKartuKeluarga>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "noKK",
    header: "No Kartu Keluarga",
  },
  {
    accessorKey: "namaKepalaKeluarga",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nama Kepala KK
          <ArrowUpDown className="ml-2 w-4 h-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "alamat",
    header: "Alamat",
  },
  {
    accessorKey: "tanggalPenerbitan",
    header: "Tanggal Penerbitan",
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const kartuKeluarga: IKartuKeluarga = row.original;
      const { setKartuKeluarga, setIsOpen } = useKKSelectedForDelete();

      async function handleOpenDialog() {
        setKartuKeluarga(kartuKeluarga);
        setIsOpen(true);
      }

      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/kartu-keluarga/detail/${kartuKeluarga.id}`}>
            <Button size={"sm"} variant={"outline"}>
              <Eye />
            </Button>
          </Link>
          <Link href={`/dashboard/kartu-keluarga/edit/${kartuKeluarga.id}`}>
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
