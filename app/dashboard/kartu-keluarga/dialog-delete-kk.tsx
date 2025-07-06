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
import { deleteKK } from "@/lib/kk";
import { useKKSelectedForDelete } from "@/store/useKKSelectedForDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function DialogDeleteKK() {
  const queryClient = useQueryClient();
  const { kartuKeluarga, isOpen, clearKartuKeluarga, setIsOpen } =
    useKKSelectedForDelete();

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => deleteKK(id),
    onSuccess: () => {
      toast.success("Berhasil menghapus data kartu keluarga");
      queryClient.invalidateQueries({ queryKey: ["kartu-keluarga"] });
      setIsOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Gagal menghapus data kartu keluarga");
      setIsOpen(false);
    },
  });

  async function handleDeleteKK() {
    mutate(kartuKeluarga.id);
  }

  async function handleCancel() {
    clearKartuKeluarga();
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini akan menghapus data kartu keluarga dengan nomor{" "}
            <span className="font-bold"> {kartuKeluarga.noKK}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isPending}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteKK} disabled={isPending}>
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
