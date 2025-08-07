"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IKartuKeluarga } from "@/types/types";
import Link from "next/link";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import { useKKSelectedForDelete } from "@/store/useKKSelectedForDelete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Banjar } from "@/consts/dataDefinitions";
import { capitalizeWords } from "@/lib/utils";

export const columns: ColumnDef<IKartuKeluarga>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },

  {
    accessorKey: "namaKepalaKeluarga",
    header: "Nama Kepala Keluarga",
    cell: ({ row }) => {
      const kartuKeluarga: IKartuKeluarga = row.original;
      return (
        <div className="">
          <p>{capitalizeWords(kartuKeluarga.namaKepalaKeluarga) || "-"}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "banjar",
    header: ({ column }) => (
      <div className="flex flex-col justify-start items-start gap-2 p-2">
        <span className="text-start">Banjar</span>
        <Select
          onValueChange={(value) => {
            column.setFilterValue(value === "all" ? undefined : value);
          }}>
          <SelectTrigger className="w-[120px] h-7 text-sm">
            <SelectValue placeholder="Pilih" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            {Banjar.map((banjar) => (
              <SelectItem key={banjar} value={banjar}>
                {banjar}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
    filterFn: (row, id, filterValue) => {
      if (!filterValue) return true;
      return (
        row.getValue(id)?.toString().toLowerCase() === filterValue.toLowerCase()
      );
    },
  },
  {
    accessorKey: "tanggalPenerbitan",
    header: "Tanggal Penerbitan",
  },
  // {
  //   accessorKey: "anggota",
  //   header: "Jumlah Anggota",
  //   cell: ({ row }) => {
  //     return <p>{row.original.jumlahAnggota || 0}</p>;
  //   },
  // },
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
