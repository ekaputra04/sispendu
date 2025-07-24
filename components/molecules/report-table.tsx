"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/config/firebase-init";
import { aggregateReportData } from "@/lib/agregatePopulationData";
import { fetchLatestReport, saveReport } from "@/lib/firestore/report";
import { ReportConditions } from "@/consts/dataDefinitions";

interface ReportData {
  category: string;
  groups: {
    name: string;
    total: { count: number; percentage: number };
    male: { count: number; percentage: number };
    female: { count: number; percentage: number };
  }[];
}

interface ReportTableProps {
  condition: string;
}

export default function ReportTable({ condition }: ReportTableProps) {
  const {
    data: report,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["latestReport"],
    queryFn: fetchLatestReport,
  });

  const filteredReport = report?.data.find((r) => r.category === condition);

  return (
    <div className="mx-auto py-8 container">
      {isLoading ? (
        <p>Memuat laporan...</p>
      ) : error ? (
        <p className="text-red-500">Gagal memuat laporan: {error.message}</p>
      ) : !filteredReport ? (
        <p>
          Tidak ada laporan tersedia untuk kategori {condition}. Klik tombol
          untuk membuat laporan.
        </p>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {ReportConditions.find((c) => c.key === filteredReport.category)
                ?.label || filteredReport.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="overflow-x-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Kelompok</TableHead>
                  <TableHead colSpan={2} className="text-center">
                    Jumlah
                  </TableHead>
                  <TableHead colSpan={2} className="text-center">
                    Laki-laki
                  </TableHead>
                  <TableHead colSpan={2} className="text-center">
                    Perempuan
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead />
                  <TableHead />
                  <TableHead className="w-[60px]">n</TableHead>
                  <TableHead className="w-[60px]">%</TableHead>
                  <TableHead className="w-[60px]">n</TableHead>
                  <TableHead className="w-[60px]">%</TableHead>
                  <TableHead className="w-[60px]">n</TableHead>
                  <TableHead className="w-[60px]">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReport.groups.map((group, i) => (
                  <TableRow key={group.name}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.total.count}</TableCell>
                    <TableCell>{group.total.percentage.toFixed(2)}%</TableCell>
                    <TableCell>{group.male.count}</TableCell>
                    <TableCell>{group.male.percentage.toFixed(2)}%</TableCell>
                    <TableCell>{group.female.count}</TableCell>
                    <TableCell>{group.female.percentage.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
