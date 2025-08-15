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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import LoadingIcon from "../atoms/loading-icon";

interface DialogDeleteUserFromKKProps {
  kkId: string;
  pendudukId: string;
}

export default function DialogDeleteUserFromKK({
  kkId,
  pendudukId,
}: DialogDeleteUserFromKKProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => deleteAnggotaFromKK({ kkId, pendudukId }),
    onSuccess: () => {
      toast.success("Berhasil menghapus data anggota keluarga");

      queryClient.invalidateQueries({ queryKey: ["kartu-keluarga", kkId] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menghapus data anggota keluarga");
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
          <AlertDialogTitle>Hapus Data Anggota Keluarga</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus data anggota keluarga ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="text-white">
            {isPending ? (
              <div className="flex items-center gap-2">
                <LoadingIcon />
                Menghapus...
              </div>
            ) : (
              <div className="">Hapus</div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
