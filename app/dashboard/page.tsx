"use client";

import { RefreshCw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aggregateReportData } from "@/lib/agregatePopulationData";
import { toast } from "sonner";
import LoadingIcon from "@/components/atoms/loading-icon";
import { Heading1 } from "@/components/atoms/heading";
import ReportView from "@/components/molecules/report-view";
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
import { ButtonCSS } from "@/consts/buttonCss";
import { useSessionStore } from "@/store/useSession";
import { useEffect, useState } from "react";
import { decrypt } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminStatus() {
      const sessionDecrypted = await decrypt(session);

      if (sessionDecrypted?.role == "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }

    checkAdminStatus();
  }, [session]);

  const generateReportMutation = useMutation({
    mutationFn: async () => {
      const response = await aggregateReportData();

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

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-y-2 mb-4">
        <Heading1 text="Laporan Penduduk" />

        {isAdmin ? (
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
                  Aksi ini memerlukan waktu sekitar 20 menit hingga selesai.
                  Mohon jangan keluar dari halaman ini dan jangan merefresh
                  halaman website.
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
        ) : (
          <Badge variant={"outline"}>
            Laporan hanya bisa diperbarui oleh admin.
          </Badge>
        )}
      </div>
      <hr className="my-4" />

      {generateReportMutation.isPending && <LoadingView />}

      <ReportView />
    </div>
  );
}
