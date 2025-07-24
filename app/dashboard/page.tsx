"use client";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Users } from "lucide-react";
import { ChartPieLabel } from "@/components/pie-chart";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TabelJenisKelamin from "@/components/molecules/tabel-jenis-kelamin";
import ReportTable from "@/components/molecules/report-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aggregateReportData } from "@/lib/agregatePopulationData";
import { fetchLatestReport, saveReport } from "@/lib/firestore/report";
import { toast } from "sonner";
import LoadingIcon from "@/components/atoms/loading-icon";
import { formatWitaDate } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";

const populations = [
  { name: "Total Penduduk", population: 5000 },
  { name: "Laki-laki", population: 2500 },
  { name: "Perempuan", population: 2500 },
  { name: "Banjar Bebalang", population: 100 },
  { name: "Banjar Tegal", population: 150 },
  { name: "Banjar Petak", population: 200 },
  { name: "Banjar Sedit", population: 200 },
  { name: "Banjar Gancan", population: 200 },
  { name: "Banjar Sembung", population: 200 },
];

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
  const [condition, setCondition] = useState<string>("all");

  const {
    data: report,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["latestReport"],
    queryFn: fetchLatestReport,
  });

  // Mutation for generating new report
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-semibold text-2xl">Laporan Penduduk</h1>

        <div className="flex items-center gap-4">
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
      {/* Kartu Statistik */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {populations.map((item) => (
          <Card key={item.name} className="@container/card">
            <CardHeader>
              <CardDescription>{item.name}</CardDescription>
              <CardTitle className="font-semibold tabular-nums text-2xl @[250px]/card:text-3xl">
                {item.population}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Users />
                </Badge>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>

      <hr className="my-6" />

      {/* Sidebar dan Chart */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
        {/* Sidebar */}
        <div>
          <p className="mb-4 font-semibold text-lg">Filter Kondisi</p>
          <div className="space-y-2">
            {conditions.map((item) => (
              <div key={item.key}>
                <Button
                  size={"sm"}
                  className="flex justify-start w-full text-start"
                  variant={condition === item.key ? "default" : "outline"}
                  onClick={() => setCondition(item.key)}>
                  {item.label}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-4 md:col-span-2">
          <ChartPieLabel />
          {condition === "all" && (
            <div>
              <TabelJenisKelamin />
            </div>
          )}
          {condition === "rentang-umur" && (
            <ReportTable condition={condition} />
          )}
          {condition === "kategori-umur" && (
            <ReportTable condition={condition} />
          )}
          {condition === "pendidikan" && <ReportTable condition={condition} />}
          {condition === "pekerjaan" && <ReportTable condition={condition} />}
          {condition === "agama" && <ReportTable condition={condition} />}
          {condition === "hubungan-dalam-kk" && (
            <ReportTable condition={condition} />
          )}
          {condition === "status-perkawinan" && (
            <ReportTable condition={condition} />
          )}
          {condition === "golongan-darah" && (
            <ReportTable condition={condition} />
          )}
          {condition === "penyandang-cacat" && (
            <ReportTable condition={condition} />
          )}
          {condition === "wilayah" && <ReportTable condition={condition} />}
        </div>
      </div>
    </div>
  );
}
