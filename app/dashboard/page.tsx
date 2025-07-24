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
import ReportTable from "@/components/molecules/report-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aggregateReportData, ReportData } from "@/lib/agregatePopulationData";
import { fetchLatestReport, saveReport } from "@/lib/firestore/report";
import { toast } from "sonner";
import LoadingIcon from "@/components/atoms/loading-icon";
import { formatWitaDate } from "@/lib/utils";
import LoadingView from "@/components/atoms/loading-view";
import { PieChartAll } from "@/components/charts/pie-chart";
import { Heading1 } from "@/components/atoms/heading";

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

  const wilayahData = report?.data.find((item) => item.category === "wilayah");
  const totalGroup = wilayahData?.groups.find(
    (group) => group.name === "Total"
  );
  const banjarGroups = wilayahData?.groups
    .filter((group) => group.name !== "Total")
    .sort((a, b) => b.total.count - a.total.count);

  return (
    <div>
      {isLoading && <LoadingView />}
      {report && (
        <>
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
          {/* Kartu Statistik */}
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {/* Kartu Total Penduduk */}
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Penduduk</CardDescription>
                <CardTitle className="font-semibold tabular-nums text-2xl @[250px]/card:text-3xl">
                  {totalGroup && totalGroup.total.count}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <Users />
                  </Badge>
                </CardAction>
              </CardHeader>
            </Card>
            {/* Kartu Total Laki-laki */}
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Laki-laki</CardDescription>
                <CardTitle className="font-semibold tabular-nums text-2xl @[250px]/card:text-3xl">
                  {totalGroup && totalGroup.male.count}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <Users />
                  </Badge>
                </CardAction>
              </CardHeader>
            </Card>
            {/* Kartu Total Perempuan */}
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Perempuan</CardDescription>
                <CardTitle className="font-semibold tabular-nums text-2xl @[250px]/card:text-3xl">
                  {totalGroup && totalGroup.female.count}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <Users />
                  </Badge>
                </CardAction>
              </CardHeader>
            </Card>
            {/* Kartu per Banjar */}
            {banjarGroups &&
              banjarGroups.map((item) => (
                <Card key={item.name} className="@container/card">
                  <CardHeader>
                    <CardDescription>{item.name}</CardDescription>
                    <CardTitle className="font-semibold tabular-nums text-2xl @[250px]/card:text-3xl">
                      {item.total.count}
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

          <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
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

            <div className="space-y-4 md:col-span-2">
              {condition === "all" && (
                <>
                  <PieChartAll
                    data={
                      report?.data?.find(
                        (item) => item.category === condition
                      ) as ReportData
                    }
                  />
                  <ReportTable condition={condition} />
                </>
              )}
              {condition === "rentang-umur" && (
                <>
                  <PieChartAll
                    data={
                      report?.data?.find(
                        (item) => item.category === condition
                      ) as ReportData
                    }
                  />
                  <ReportTable condition={condition} />
                </>
              )}
              {condition === "kategori-umur" && (
                <>
                  <PieChartAll
                    data={
                      report?.data?.find(
                        (item) => item.category === condition
                      ) as ReportData
                    }
                  />
                  <ReportTable condition={condition} />
                </>
              )}
              {condition === "pendidikan" && (
                <>
                  <PieChartAll
                    data={
                      report?.data?.find(
                        (item) => item.category === condition
                      ) as ReportData
                    }
                  />
                  <ReportTable condition={condition} />
                </>
              )}
              {condition === "pekerjaan" && (
                <>
                  <PieChartAll
                    data={
                      report?.data?.find(
                        (item) => item.category === condition
                      ) as ReportData
                    }
                  />
                  <ReportTable condition={condition} />
                </>
              )}
              {condition === "agama" && (
                <>
                  <PieChartAll
                    data={
                      report?.data?.find(
                        (item) => item.category === condition
                      ) as ReportData
                    }
                  />
                  <ReportTable condition={condition} />
                </>
              )}
              {condition === "hubungan-dalam-kk" && (
                <>
                  <PieChartAll
                    data={
                      report?.data?.find(
                        (item) => item.category === condition
                      ) as ReportData
                    }
                  />
                  <ReportTable condition={condition} />
                </>
              )}
              {condition === "status-perkawinan" && (
                <>
                  <PieChartAll
                    data={
                      report?.data?.find(
                        (item) => item.category === condition
                      ) as ReportData
                    }
                  />
                  <ReportTable condition={condition} />
                </>
              )}
              {condition === "golongan-darah" && (
                <>
                  <PieChartAll
                    data={
                      report?.data?.find(
                        (item) => item.category === condition
                      ) as ReportData
                    }
                  />
                  <ReportTable condition={condition} />
                </>
              )}
              {condition === "penyandang-cacat" && (
                <>
                  <PieChartAll
                    data={
                      report?.data?.find(
                        (item) => item.category === condition
                      ) as ReportData
                    }
                  />
                  <ReportTable condition={condition} />
                </>
              )}
              {condition === "wilayah" && (
                <>
                  <PieChartAll
                    data={
                      report?.data?.find(
                        (item) => item.category === condition
                      ) as ReportData
                    }
                  />
                  <ReportTable condition={condition} />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
