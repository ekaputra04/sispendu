"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ButtonDestructiveCSS } from "@/consts/buttonCss";
import { deleteAnggotaFromKK } from "@/lib/firestore/kartu-keluarga";
import { removeFromEditedBy } from "@/lib/firestore/penduduk";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface DialogDeleteEmailEditedByProps {
  pendudukId: string;
  email: string;
}

export default function DialogDeleteEmailEditedBy({
  pendudukId,
  email,
}: DialogDeleteEmailEditedByProps) {
  const queryClient = useQueryClient();

  if (!pendudukId || !email) {
    return;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => removeFromEditedBy(pendudukId, email),
    onSuccess: () => {
      toast.success("Berhasil menghapus akses email dari data penduduk");

      queryClient.invalidateQueries({ queryKey: ["penduduk", pendudukId] });
    },
    onError: (error: any) => {
      toast.error(
        error.message || "Gagal menghapus akses email dari data penduduk"
      );
    },
  });

  async function handleDelete() {
    mutate();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className={ButtonDestructiveCSS}>
        <Trash />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Akses Email</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus akses email ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
