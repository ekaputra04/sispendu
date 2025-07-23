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
import { ChartPieLabel } from "@/components/pie-chart";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TabelJenisKelamin from "@/components/molecules/tabel-jenis-kelamin";

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
  const [condition, setCondition] = useState<string>("all");

  return (
    <div>
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
          {condition === "rentang-umur" && <div>Diagram Rentang Umur</div>}
          {condition === "kategori-umur" && <div>Diagram Kategori Umur</div>}
          {condition === "pendidikan" && <div>Diagram Pendidikan</div>}
          {condition === "pekerjaan" && <div>Diagram Pekerjaan</div>}
          {condition === "agama" && <div>Diagram Agama</div>}
          {condition === "hubungan-dalam-kk" && (
            <div>Diagram Hubungan dalam KK</div>
          )}
          {condition === "status-perkawinan" && (
            <div>Diagram Status Perkawinan</div>
          )}
          {condition === "golongan-darah" && <div>Diagram Golongan Darah</div>}
          {condition === "penyandang-cacat" && (
            <div>Diagram Penyandang Cacat</div>
          )}
          {condition === "wilayah" && <div>Diagram Wilayah</div>}
        </div>
      </div>
    </div>
  );
}
