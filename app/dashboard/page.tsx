"use client";

import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aggregateReportData } from "@/lib/agregatePopulationData";
import { fetchLatestReport, saveReport } from "@/lib/firestore/report";
import { toast } from "sonner";
import LoadingIcon from "@/components/atoms/loading-icon";
import { formatWitaDate } from "@/lib/utils";
import { Heading1 } from "@/components/atoms/heading";
import ReportView from "@/components/molecules/report-view";

const conditions = [
  { key: "all", label: "Semua" },
  { key: "rentang-umur", label: "Rentang Umur" },
  { key: "kategori-umur", label: "Kategori Umur" },
  { key: "pendidikan", label: "Pendidikan" },
  { key: "pekerjaan", label: "Pekerjaan" },
  { key: "agama", label: "Agama" },
  { key: "hubungan-dalam-kk", label: "Hubungan dalam KK" },
  { key: "status-perkawinan", label: "Status Perkawinan" },
  { key: "golongan-darah", label: "Golongan Darah" },
  { key: "penyandang-cacat", label: "Penyandang cacat" },
  { key: "wilayah", label: "Wilayah" },
];

export default function Page() {
  const queryClient = useQueryClient();

  const { data: report } = useQuery({
    queryKey: ["latestReport"],
    queryFn: fetchLatestReport,
  });

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
    },
    onError: (error: any) => {
      toast.error("Gagal membuat laporan: " + error.message);
    },
  });

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-y-2 mb-6">
        <Heading1 text="Laporan Penduduk" />

        <div className="flex flex-wrap items-center gap-4">
          <Badge variant={"outline"}>
            Terakhir diperbarui {formatWitaDate(report?.createdAt)}
          </Badge>
          <Button
            onClick={() => generateReportMutation.mutate()}
            disabled={generateReportMutation.isPending}>
            {generateReportMutation.isPending ? (
              <>
                <LoadingIcon />
                Memproses...
              </>
            ) : (
              <>
                <RefreshCw /> Perbarui Laporan
              </>
            )}
          </Button>
        </div>
      </div>
      <ReportView />
    </div>
  );
}
