"use client";

import LoadingIcon from "@/components/atoms/loading-icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePenggunaSelectedForUpdate } from "@/store/usePenggunaSelectedForUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { updateUserRole } from "@/lib/firestore/users";

export default function DialogEditPengguna() {
  const queryClient = useQueryClient();
  const { pengguna, isOpen, clearPengguna, setIsOpen } =
    usePenggunaSelectedForUpdate();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (pengguna) {
      setRole(pengguna.role as string);
    } else {
      setRole("");
    }
  }, [pengguna]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      updateUserRole(userId, role),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["pengguna"] });
        handleCancel();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal memperbarui role pengguna");
    },
  });

  async function handleUpdateRole() {
    if (pengguna && role) {
      mutate({ userId: pengguna.id, role });
    } else {
      toast.error("Pengguna atau role tidak valid");
    }
  }

  function handleCancel() {
    clearPengguna();
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Role Pengguna</AlertDialogTitle>
          <AlertDialogDescription>
            Ubah role pengguna sesuai pilihan di bawah
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Select
          value={role}
          onValueChange={(value) => {
            setRole(value);
          }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="petugas">Petugas</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isPending}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpdateRole}
            disabled={isPending || !role || !pengguna}>
            {isPending ? (
              <>
                <LoadingIcon />
                <p>Proses</p>
              </>
            ) : (
              <p>Simpan</p>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
