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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  { key: "all", label: "Semua", active: true },
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
  return (
    <div>
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
      <hr className="my-4" />
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
        <div className="">
          <p className="mb-4 font-semibold text-lg">Filter Kondisi</p>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <div className="" key={condition.key}>
                <Button
                  size={"sm"}
                  className="flex justify-start w-full text-start"
                  variant={condition.active ? "default" : "outline"}>
                  {condition.label}
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 md:col-span-2">
          <ChartPieLabel />
          <Table>
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
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>Laki-laki</TableCell>
                <TableCell>3</TableCell>
                <TableCell>0,10%</TableCell>
                <TableCell>1</TableCell>
                <TableCell>0,03%</TableCell>
                <TableCell>2</TableCell>
                <TableCell>0,07%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2</TableCell>
                <TableCell>Perempuan</TableCell>
                <TableCell>1</TableCell>
                <TableCell>0,03%</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0,00%</TableCell>
                <TableCell>1</TableCell>
                <TableCell>0,03%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell>Total</TableCell>
                <TableCell>1</TableCell>
                <TableCell>0,03%</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0,00%</TableCell>
                <TableCell>1</TableCell>
                <TableCell>0,03%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
