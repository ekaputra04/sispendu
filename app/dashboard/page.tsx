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

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

      <ReportView />
    </div>
  );
}
