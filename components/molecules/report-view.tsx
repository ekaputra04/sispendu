"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ReportTable from "@/components/molecules/report-table";
import { useQuery } from "@tanstack/react-query";
import { ReportData } from "@/lib/agregatePopulationData";
import { fetchLatestReport, fetchLatestReportKK } from "@/lib/firestore/report";
import LoadingView from "@/components/atoms/loading-view";
import { PieChartAll } from "@/components/charts/pie-chart";
import { formatWitaDate } from "@/lib/utils";

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

export default function ReportView() {
  const [condition, setCondition] = useState<string>("all");

  const {
    data: report,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["latestReport"],
    queryFn: fetchLatestReport,
  });

  const {
    data: reportKK,
    isLoading: isLoadingKK,
    error: errorKK,
  } = useQuery({
    queryKey: ["latestReportKK"],
    queryFn: fetchLatestReportKK,
  });

  const wilayahData = report?.data.find((item) => item.category === "wilayah");
  const totalGroup = wilayahData?.groups.find(
    (group) => group.name === "Total"
  );
  const banjarGroups = wilayahData?.groups
    .filter((group) => group.name !== "Total")
    .sort((a, b) => b.total.count - a.total.count);

  // Hitung penduduk yang belum terdaftar dalam KK
  const totalAnggotaKK =
    reportKK?.data?.groups.find((group) => group.name === "Total")?.totalAnggota
      .count || 0;
  const pendudukBelumKK = totalGroup
    ? totalGroup.total.count - totalAnggotaKK
    : 0;

  return (
    <div>
      {(isLoading || isLoadingKK) && <LoadingView />}
      {error && (
        <div className="text-red-500">Error: {(error as Error).message}</div>
      )}
      {errorKK && (
        <div className="text-red-500">
          Error KK: {(errorKK as Error).message}
        </div>
      )}
      {report && reportKK && (
        <>
          {/* Kartu Statistik */}
          <div className="flex justify-end mb-4">
            <Badge variant="outline">
              Terakhir diperbarui {formatWitaDate(report?.createdAt)}
            </Badge>
          </div>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription className="flex justify-between items-center">
                  <p>Total Penduduk</p>
                  <Badge variant="outline">
                    <Users />
                  </Badge>
                </CardDescription>
                <CardTitle className="font-semibold tabular-nums text-2xl @[250px]/card:text-3xl">
                  {totalGroup ? totalGroup.total.count : 0}
                </CardTitle>
                <CardContent className="m-0 mt-4 p-0">
                  <Badge
                    className="bg-red-100 border-red-600 text-red-600 text-sm"
                    variant={"outline"}>
                    {pendudukBelumKK} - Belum Terdaftar KK
                  </Badge>
                </CardContent>
              </CardHeader>
            </Card>
            {/* Kartu Total Laki-laki */}
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Laki-laki</CardDescription>
                <CardTitle className="font-semibold tabular-nums text-2xl @[250px]/card:text-3xl">
                  {totalGroup ? totalGroup.male.count : 0}
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
                  {totalGroup ? totalGroup.female.count : 0}
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
              banjarGroups.map((item) => {
                const banjarKK = reportKK?.data?.groups.find(
                  (group) => group.name === item.name
                );
                console.log("Banjar KK:", banjarKK);

                return (
                  <Card key={item.name}>
                    <CardHeader>
                      <CardDescription className="flex justify-between items-center">
                        {item.name}
                        <Badge variant="outline">
                          <Users />
                        </Badge>
                      </CardDescription>
                      <CardTitle className="flex justify-between items-center font-semibold text-2xl @[250px]/card:text-3xl">
                        {item.total.count}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="-mt-2">
                      <div className="flex justify-between gap-2 font-normal">
                        <Badge
                          className="bg-green-100 border-green-600 text-green-600 text-sm"
                          variant={"outline"}>
                          {banjarKK ? banjarKK.totalKK.count : 0} - Kartu
                          Keluarga
                        </Badge>
                        <Badge
                          className="bg-blue-100 border-blue-600 text-blue-600 text-sm"
                          variant={"outline"}>
                          {banjarKK ? banjarKK.totalAnggota.count : 0} -
                          Penduduk
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
                      className="flex justify-start w-full dark:text-white text-start"
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
