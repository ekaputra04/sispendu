"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IDataPengguna } from "@/types/types";
import Link from "next/link";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import { Badge } from "@/components/ui/badge";
import { usePenggunaSelectedForUpdate } from "@/store/usePenggunaSelectedForUpdate";

export const columns: ColumnDef<IDataPengguna>[] = [
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const pengguna: IDataPengguna = row.original;

      if (pengguna.role === "admin") {
        return <Badge className="bg-green-700 text-white">Admin</Badge>;
      } else {
        return <Badge variant={"outline"}>{pengguna.role}</Badge>;
      }
    },
  },
  {
    id: "Aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const pengguna: IDataPengguna = row.original;

      const { setPengguna, setIsOpen } = usePenggunaSelectedForUpdate();

      async function handleOpenDialog() {
        setPengguna(pengguna);
        setIsOpen(true);
      }

      return (
        <div className="flex gap-2">
          <Button size={"sm"} variant={"outline"} onClick={handleOpenDialog}>
            <Pencil />
          </Button>
        </div>
      );
    },
  },
];
