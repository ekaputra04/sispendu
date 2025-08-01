"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IContact } from "@/types/types";
import { formatWitaDate } from "@/lib/utils";

export const columns: ColumnDef<IContact>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "nama",
    header: "Nama Pengirim",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "pesan",
    header: "Pesan",
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      return <p>{formatWitaDate(row.original.createdAt)}</p>;
    },
  },
];
