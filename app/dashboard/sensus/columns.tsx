"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ISensus } from "@/types/types";
import { formatWitaDate } from "@/lib/utils";

export const columns: ColumnDef<ISensus>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "tanggalSensus",
    header: "Tanggal",
  },
  {
    accessorKey: "lokasi",
    header: "Lokasi",
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
  },
];
