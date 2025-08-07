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
import { getCurrentUser } from "@/lib/firestore/users";
import { useRouter } from "next/navigation";
import { saveDataToFirestore } from "@/lib/firestore/import-data";
import { useState } from "react";
import LoadingView from "@/components/atoms/loading-view";

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  // const {
  //   data: userLogin,
  //   isLoading: isGetUserLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["user-login"],
  //   queryFn: getCurrentUser,
  // });

  // if (
  //   !isGetUserLoading &&
  //   userLogin?.success === false &&
  //   userLogin.data?.role in ["admin", "petugas"]
  // ) {
  //   router.push("/login");
  // }

  const generateReportMutation = useMutation({
    mutationFn: async () => {
      const reportData = await aggregateReportData();
      const result = await saveReport(reportData);
      if (!result.success) {
        throw new Error(result.message);
      }
      return reportData;
    },
    onSuccess: () => {
      toast.success("Laporan baru berhasil dibuat");

      queryClient.invalidateQueries({ queryKey: ["latestReport"] });
      queryClient.invalidateQueries({ queryKey: ["latestReportKK"] });
    },
    onError: (error: any) => {
      toast.error("Gagal membuat laporan: " + error.message);
    },
  });
  async function handleImportData() {
    setIsLoading(true);
    try {
      const response = await saveDataToFirestore();
      if (response.success) {
        alert("Data berhasil diimport");
      }
    } catch (error) {
      alert("Gagal mengimport data");
      console.error("Error importing data:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-y-2 mb-4">
        <Heading1 text="Laporan Penduduk" />

        <Button
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
        </Button>
      </div>
      <hr className="my-4" />
      {isLoading && <LoadingView />}

      <Button onClick={handleImportData}>Import Data</Button>

      <ReportView />
    </div>
  );
}
