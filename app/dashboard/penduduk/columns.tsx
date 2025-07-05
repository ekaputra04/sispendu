"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IDataPenduduk } from "@/types/types";
import Link from "next/link";

export const columns: ColumnDef<IDataPenduduk>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "nik",
    header: "NIK",
  },
  {
    accessorKey: "nama",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nama Lengkap
          <ArrowUpDown className="ml-2 w-4 h-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "tempatLahir",
    header: "Tempat Lahir",
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
      const kartuKeluarga = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 w-8 h-8">
              <span className="sr-only">Buka Menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <Link href={`/dashboard/penduduk/detail/${kartuKeluarga.id}`}>
              <DropdownMenuItem
                onClick={() => console.log("Tombol di klik", kartuKeluarga)}>
                <Eye />
                Lihat Detail Penduduk
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Pencil /> Update Data Penduduk
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash />
              Hapus Data Penduduk
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
