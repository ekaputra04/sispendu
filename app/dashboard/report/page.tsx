"use client";

import { useState, useEffect } from "react";
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
import { saveReport } from "@/lib/firestore/report";
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

export default function ReportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ReportData[]>([]);

  useEffect(() => {
    fetchLatestReport();
  }, []);

  const fetchLatestReport = async () => {
    try {
      const reportQuery = query(
        collection(db, "report"),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const reportSnapshot = await getDocs(reportQuery);
      if (!reportSnapshot.empty) {
        const latestReport = reportSnapshot.docs[0].data().data as ReportData[];
        setReport(latestReport);
      } else {
        setReport([]);
      }
    } catch (error: any) {
      toast.error("Gagal memuat laporan: " + error.message);
    }
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const reportData = await aggregateReportData();
      const result = await saveReport(reportData);
      if (result.success) {
        toast.success(result.message);
        await fetchLatestReport();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error("Gagal membuat laporan: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto py-8 container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-3xl">Laporan Penduduk</h1>
        <Button onClick={handleGenerateReport} disabled={isLoading}>
          {isLoading ? "Memproses..." : "Buat Laporan Baru"}
        </Button>
      </div>

      {report.length === 0 ? (
        <p>Tidak ada laporan tersedia. Klik tombol untuk membuat laporan.</p>
      ) : (
        report.map((category) => (
          <Card key={category.category} className="mb-6">
            <CardHeader>
              <CardTitle>
                {ReportConditions.find((c) => c.key === category.category)
                  ?.label || category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="overflow-x-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead>Kelompok</TableHead>
                    <TableHead>Jumlah (n)</TableHead>
                    <TableHead>Jumlah (%)</TableHead>
                    <TableHead>Laki-laki (n)</TableHead>
                    <TableHead>Laki-laki (%)</TableHead>
                    <TableHead>Perempuan (n)</TableHead>
                    <TableHead>Perempuan (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.groups.map((group) => (
                    <TableRow key={group.name}>
                      <TableCell>{group.name}</TableCell>
                      <TableCell>{group.total.count}</TableCell>
                      <TableCell>
                        {group.total.percentage.toFixed(2)}%
                      </TableCell>
                      <TableCell>{group.male.count}</TableCell>
                      <TableCell>{group.male.percentage.toFixed(2)}%</TableCell>
                      <TableCell>{group.female.count}</TableCell>
                      <TableCell>
                        {group.female.percentage.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
