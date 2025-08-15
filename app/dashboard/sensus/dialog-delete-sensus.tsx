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
import { deleteSensus } from "@/lib/firestore/sensus";
import { useSensusSelectedForDelete } from "@/store/useSensusSelectedForDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function DialogDeleteSensus() {
  const queryClient = useQueryClient();
  const { sensus, isOpen, clearSensus, setIsOpen } =
    useSensusSelectedForDelete();

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => deleteSensus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sensus"] });
      toast.success("Berhasil menghapus data sensus");
      setIsOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Gagal menghapus data sensus");
      setIsOpen(false);
    },
  });

  async function handleDeleteSensus() {
    if (sensus) {
      mutate(sensus.id);
    }
  }

  async function handleCancel() {
    clearSensus();
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini akan menghapus data sensus pada tanggal{" "}
            <span className="font-bold">{sensus?.tanggalSensus || ""}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isPending}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteSensus}
            disabled={isPending}
            className="text-white">
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
