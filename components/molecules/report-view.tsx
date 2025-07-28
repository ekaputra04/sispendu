"use client";

import {
  Card,
  CardAction,
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
import { fetchLatestReport } from "@/lib/firestore/report";
import LoadingView from "@/components/atoms/loading-view";
import { PieChartAll } from "@/components/charts/pie-chart";

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
