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
import { deletePenduduk } from "@/lib/firestore/penduduk";
import { usePendudukSelectedForDelete } from "@/store/usePendudukSelectedForDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function DialogDeletePenduduk() {
  const queryClient = useQueryClient();
  const { penduduk, isOpen, clearPenduduk, setIsOpen } =
    usePendudukSelectedForDelete();

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => deletePenduduk(id),
    onSuccess: () => {
      toast.success("Berhasil menghapus data penduduk");
      queryClient.invalidateQueries({ queryKey: ["penduduk"] });
      handleCancel();
    },

    onError: (error: any) => {
      toast.error(error.message || "Gagal menghapus data penduduk");
      handleCancel();
    },
  });

  async function handleDelete() {
    if (penduduk) {
      mutate(penduduk.id);
    }
  }

  async function handleCancel() {
    clearPenduduk();
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini akan menghapus data penduduk dengan nama{" "}
            <span className="font-bold"> {penduduk?.nama}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isPending}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? (
              <>
                <LoadingIcon />
                <p>Proses</p>
              </>
            ) : (
              "Hapus"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
