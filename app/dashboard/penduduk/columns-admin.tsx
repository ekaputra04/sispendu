"use client";

import { Timestamp } from "firebase/firestore";
import { Eye, Filter, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { Banjar, JenisPekerjaan } from "@/consts/dataDefinitions";
import { calculateAge, formatWitaDate } from "@/lib/utils";
import { usePendudukSelectedForDelete } from "@/store/usePendudukSelectedForDelete";
import { IDataPenduduk } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";

export const columnsAdmin: ColumnDef<IDataPenduduk>[] = [
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
    cell: ({ row }) => {
      const penduduk: IDataPenduduk = row.original;
      return <p className="uppercase">{penduduk.nama}</p>;
    },
  },
  {
    accessorKey: "jenisKelamin",
    header: "Jenis Kelamin",
    cell: ({ row }) => {
      const penduduk: IDataPenduduk = row.original;
      return <p className="uppercase">{penduduk.jenisKelamin}</p>;
    },
  },
  {
    accessorKey: "tanggalLahir",
    header: "Tanggal Lahir",
  },
  {
    accessorKey: "usia",
    header: "Usia",
    cell: ({ row }) => {
      const penduduk: IDataPenduduk = row.original;
      const { years } = calculateAge(penduduk.tanggalLahir);
      return <p>{penduduk.tanggalLahir && years}</p>;
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
      const penduduk: IDataPenduduk = row.original;
      return <p className="uppercase">{penduduk.banjar}</p>;
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue) return true;
      return (
        row.getValue(id)?.toString().toLowerCase() === filterValue.toLowerCase()
      );
    },
  },
  {
    accessorKey: "jenisPekerjaan",
    header: ({ column }) => (
      <div className="flex flex-col justify-start items-start gap-2 p-2">
        <span className="text-start">Pekerjaan</span>
        <Select
          onValueChange={(value) => {
            column.setFilterValue(value === "all" ? undefined : value);
          }}>
          <SelectTrigger className="w-[120px] h-7 text-sm">
            <SelectValue placeholder="Pilih" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            {JenisPekerjaan.map((pekerjaan) => (
              <SelectItem key={pekerjaan} value={pekerjaan}>
                {pekerjaan}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
    cell: ({ row }) => {
      const penduduk: IDataPenduduk = row.original;
      return <p className="uppercase">{penduduk.jenisPekerjaan}</p>;
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue) return true;
      return (
        row.getValue(id)?.toString().toLowerCase() === filterValue.toLowerCase()
      );
    },
  },
  {
    accessorKey: "kkRef",
    header: ({ column }) => (
      <div className="flex flex-col justify-start items-start gap-2 p-2">
        <span className="text-start">Terdaftar di KK</span>
        <Select
          onValueChange={(value) => {
            column.setFilterValue(value === "all" ? undefined : value);
          }}>
          <SelectTrigger className="w-[120px] h-7 text-sm">
            <SelectValue placeholder="Pilih" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="true">Ya</SelectItem>
            <SelectItem value="false">Tidak</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
    cell: ({ row }) => {
      const penduduk: IDataPenduduk = row.original;
      return (
        <Badge
          variant={penduduk.kkRef ? "default" : "destructive"}
          className="text-white">
          {penduduk.kkRef ? (
            <Link href={`/dashboard/kartu-keluarga/detail/${penduduk.kkRef}`}>
              <div className="flex items-center gap-2">
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
    filterFn: (row, id, filterValue) => {
      const hasKK = !!row.getValue(id);
      if (!filterValue) return true;
      return hasKK === (filterValue === "true");
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
      const penduduk: IDataPenduduk = row.original;
      return <p className="uppercase">{formatWitaDate(penduduk.updatedAt)}</p>;
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
