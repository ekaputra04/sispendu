"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ISensus } from "@/types/types";
import { useSensusSelectedForDelete } from "@/store/useSensusSelectedForDelete";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import { Pencil, Trash } from "lucide-react";

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
    accessorKey: "petugas",
    header: "Petugas",
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
  },
  {
    id: "Aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const sensus: ISensus = row.original;
      const { setSensus, setIsOpen } = useSensusSelectedForDelete();

      async function handleOpenDialog() {
        setSensus(sensus);
        setIsOpen(true);
      }

      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/sensus/edit/${sensus.id}`} className="block">
            <Button
              size={"sm"}
              variant={"outline"}
              className={ButtonOutlineGreen}>
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            size={"sm"}
            variant={"destructive"}
            onClick={handleOpenDialog}>
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
