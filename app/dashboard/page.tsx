"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aggregateReportData } from "@/lib/agregatePopulationData";
import { saveReport } from "@/lib/firestore/report";
import { toast } from "sonner";
import LoadingIcon from "@/components/atoms/loading-icon";
import { Heading1 } from "@/components/atoms/heading";
import ReportView from "@/components/molecules/report-view";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingView from "@/components/atoms/loading-view";
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
import { deleteAllPenduduk } from "@/lib/firestore/penduduk";
import { deleteAllKartuKeluarga } from "@/lib/firestore/kartu-keluarga";
import { ButtonCSS } from "@/consts/buttonCss";
// import { saveDataToFirestore } from "@/lib/firestore/import-data";

export default function Page() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  // const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const generateReportMutation = useMutation({
    mutationFn: async () => {
      const response = await aggregateReportData();
      // const result = await saveReport(reportData);
      if (!response.success) {
        toast.error(response.message);
        throw new Error(response.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["latestReport"] });
      queryClient.invalidateQueries({ queryKey: ["latestReportKK"] });
      toast.success("Laporan baru berhasil dibuat");
    },
    onError: (error: any) => {
      toast.error("Gagal membuat laporan: " + error.message);
    },
  });

  // async function handleDeleteAllPenduduk() {
  //   setIsLoadingDelete(true);
  //   try {
  //     const response = await deleteAllPenduduk();
  //     if (response.success) {
  //       toast.success(response.message);
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     toast.error(error as string);
  //   } finally {
  //     setIsLoadingDelete(false);
  //   }
  // }

  // async function handleDeleteAllKartuKeluarga() {
  //   setIsLoadingDelete(true);
  //   try {
  //     const response = await deleteAllKartuKeluarga();
  //     if (response.success) {
  //       toast.success(response.message);
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     toast.error(error as string);
  //   } finally {
  //     setIsLoadingDelete(false);
  //   }
  // }

  // async function handleAddData() {
  //   setIsLoading(true);
  //   try {
  //     const response = await saveDataToFirestore();
  //     if (response.success) {
  //       toast.success("Data berhasil diimport");
  //     } else {
  //       toast.error("Gagal mengimport data");
  //     }
  //   } catch (error) {
  //     toast.error("Gagal mengimport data");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-y-2 mb-4">
        <Heading1 text="Laporan Penduduk" />

        <AlertDialog>
          <AlertDialogTrigger>
            <div
              className={`flex justify-between items-center gap-2 text-white bg-primary ${ButtonCSS}`}>
              <RefreshCw />
              <span>Perbarui Laporan</span>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Perbarui Laporan Penduduk?</AlertDialogTitle>
              <AlertDialogDescription>
                Aksi ini memerlukan waktu sekitar 20 menit hingga selesai. Mohon
                jangan keluar dari halaman ini dan jangan merefresh halaman
                website.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => generateReportMutation.mutate()}
                disabled={generateReportMutation.isPending}>
                {generateReportMutation.isPending ? (
                  <div className="flex justify-between items-center gap-2 dark:text-white">
                    <LoadingIcon />
                    Memproses...
                  </div>
                ) : (
                  <div className="flex justify-between items-center gap-2 dark:text-white">
                    <RefreshCw />
                    <span>Perbarui Laporan</span>
                  </div>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <hr className="my-4" />
      {/* <Button onClick={handleAddData} disabled={isLoading}>
        <div className="flex justify-between items-center gap-2 dark:text-white">
          <RefreshCw />
          <span>Import Data Penduduk</span>
        </div>
      </Button>

      <Button onClick={handleDeleteAllPenduduk}>
        {isLoadingDelete ? "Menghapus..." : "Hapus Semua Data Penduduk"}
      </Button>
      <Button onClick={handleDeleteAllKartuKeluarga}>
        {isLoadingDelete ? "Menghapus..." : "Hapus Semua Data Kartu Keluarga"}
      </Button>
      {isLoadingDelete && <LoadingView />} */}

      {/* {isLoading && <LoadingView />} */}
      {generateReportMutation.isPending && <LoadingView />}

      <ReportView />
    </div>
  );
}
