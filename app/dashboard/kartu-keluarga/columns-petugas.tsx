"use client";

import { Timestamp } from "firebase/firestore";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import { Banjar } from "@/consts/dataDefinitions";
import { formatWitaDate } from "@/lib/utils";
import { IKartuKeluarga } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";

export const columnsPetugas: ColumnDef<IKartuKeluarga>[] = [
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
        <p className="uppercase">{kartuKeluarga.namaKepalaKeluarga || "-"}</p>
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
    cell: ({ row }) => {
      const kartuKeluarga: IKartuKeluarga = row.original;
      return <p className="uppercase">{kartuKeluarga.banjar || "-"}</p>;
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue) return true;
      return (
        row.getValue(id)?.toString().toLowerCase() === filterValue.toLowerCase()
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      const [date, setDate] = useState<string>("");
      return (
        <div className="flex flex-col justify-start items-start gap-2 p-2">
          <span className="text-start">Terakhir Diperbarui</span>
          <Input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              column.setFilterValue(
                e.target.value ? new Date(e.target.value) : undefined
              );
            }}
            placeholder="Pilih tanggal"
            className="w-[150px] h-7 text-sm"
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const kartuKeluarga: IKartuKeluarga = row.original;
      return (
        <p className="uppercase">{formatWitaDate(kartuKeluarga.updatedAt)}</p>
      );
    },
    filterFn: (row, id, filterValue: Date | undefined) => {
      if (!filterValue) return true;
      const updatedAt = row.getValue(id);
      if (!(updatedAt instanceof Timestamp)) return false;
      const updatedAtDate = updatedAt.toDate();
      return updatedAtDate <= filterValue;
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const kartuKeluarga: IKartuKeluarga = row.original;

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
        </div>
      );
    },
  },
];
