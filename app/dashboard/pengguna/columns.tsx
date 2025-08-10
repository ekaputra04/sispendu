"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IDataPengguna } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { usePenggunaSelectedForUpdate } from "@/store/usePenggunaSelectedForUpdate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/store/useUserStore";

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
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <span>Role</span>
        <Select
          onValueChange={(value) => {
            column.setFilterValue(value === "all" ? undefined : value);
          }}>
          <SelectTrigger className="w-[120px] h-8 text-sm">
            <SelectValue placeholder="Pilih Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="petugas">Petugas</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
    cell: ({ row }) => {
      const pengguna: IDataPengguna = row.original;
      return (
        <>
          {pengguna.role == "admin" ? (
            <Badge>
              {pengguna.role.charAt(0).toUpperCase() + pengguna.role.slice(1)}
            </Badge>
          ) : pengguna.role == "petugas" ? (
            <Badge className="bg-blue-600">
              {pengguna.role.charAt(0).toUpperCase() + pengguna.role.slice(1)}
            </Badge>
          ) : (
            <Badge variant={"outline"}>
              {pengguna.role.charAt(0).toUpperCase() + pengguna.role.slice(1)}
            </Badge>
          )}
        </>
      );
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue) return true;
      return (
        row.getValue(id)?.toString().toLowerCase() === filterValue.toLowerCase()
      );
    },
  },
  {
    id: "Aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const pengguna: IDataPengguna = row.original;

      const { user } = useUserStore();

      const { setPengguna, setIsOpen } = usePenggunaSelectedForUpdate();

      async function handleOpenDialog() {
        setPengguna(pengguna);
        setIsOpen(true);
      }

      return (
        <>
          {pengguna.email != user.email && (
            <div className="flex gap-2">
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={handleOpenDialog}>
                <Pencil />
              </Button>
            </div>
          )}
        </>
      );
    },
  },
];
