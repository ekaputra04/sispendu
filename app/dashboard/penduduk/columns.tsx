"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Filter, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IDataPenduduk } from "@/types/types";
import Link from "next/link";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import { usePendudukSelectedForDelete } from "@/store/usePendudukSelectedForDelete";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Banjar, JenisPekerjaan } from "@/consts/dataDefinitions";
import { calculateAge, capitalizeWords } from "@/lib/utils";

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
    cell: ({ row }) => {
      const penduduk: IDataPenduduk = row.original;
      return (
        <div className="">
          <p>{capitalizeWords(penduduk.nama)}</p>
        </div>
      );
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
      return (
        <div className="">
          <p>{penduduk.tanggalLahir && years}</p>
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
