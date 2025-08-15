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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonOutlineCSS } from "@/consts/buttonCss";
import { StatusHubunganDalamKeluarga } from "@/consts/dataDefinitions";
import { updateStatusHubunganDalamKeluarga } from "@/lib/firestore/kartu-keluarga";
import { IDataPenduduk, TStatusHubunganDalamKeluarga } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditStatusProps {
  kkId: string;
  pendudukId: string;
  statusBaru: TStatusHubunganDalamKeluarga;
}

interface DialogEditStatusHubunganProps {
  penduduk: IDataPenduduk;
  statusHubunganDalamKeluarga: TStatusHubunganDalamKeluarga;
}

export default function DialogEditStatusHubungan({
  penduduk,
  statusHubunganDalamKeluarga,
}: DialogEditStatusHubunganProps) {
  const queryClient = useQueryClient();
  const [statusHubungan, setStatusHubungan] =
    useState<TStatusHubunganDalamKeluarga>(statusHubunganDalamKeluarga);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: EditStatusProps) =>
      updateStatusHubunganDalamKeluarga(
        data.kkId,
        data.pendudukId,
        data.statusBaru
      ),
    onSuccess: () => {
      toast.success("Berhasil memperbarui status hubungan dalam keluarga");

      queryClient.invalidateQueries({ queryKey: ["kartu-keluarga"] });
    },
    onError: (error: any) => {
      toast.error(
        error.message || "Gagal memperbarui status hubungan dalam keluarga"
      );
    },
  });

  async function onSubmit() {
    const dataSubmit: EditStatusProps = {
      kkId: penduduk.kkRef as string,
      pendudukId: penduduk.id as string,
      statusBaru: statusHubungan,
    };

    console.log(dataSubmit);

    mutate(dataSubmit);
  }

  return (
    <div className="">
      <AlertDialog>
        <AlertDialogTrigger className={ButtonOutlineCSS}>
          <Pencil className="w-4 h-4" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Edit Status Hubungan dalam Keluarga
            </AlertDialogTitle>
            <AlertDialogDescription>
              Silahkan pilih status hubungan yang sesuai untuk anggota bernama{" "}
              <span className="font-bold">{penduduk.nama}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Select
            value={statusHubungan}
            onValueChange={(e) =>
              setStatusHubungan(e as TStatusHubunganDalamKeluarga)
            }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status Hubungan dalam Keluarga" />
            </SelectTrigger>
            <SelectContent>
              {StatusHubunganDalamKeluarga.map((status) => (
                <SelectItem value={status} key={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={onSubmit} className="text-white">
              {isPending ? "Proses..." : "Simpan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
