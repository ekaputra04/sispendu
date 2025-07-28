"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/molecules/navbar";
import { getKKByCreatedBy } from "@/lib/firestore/kartu-keluarga";
import { useUserStore } from "@/store/useUserStore";
import { AlertCircle, PlusCircle } from "lucide-react";
import { getPendudukByCreatedBy } from "@/lib/firestore/penduduk";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PreviewPage() {
  const { user } = useUserStore();

  const {
    data: kkData,
    isLoading: isKKLoading,
    error: kkError,
  } = useQuery({
    queryKey: ["kartu-keluarga", user?.email],
    queryFn: () => getKKByCreatedBy(user?.email || ""),
    enabled: !!user?.email,
  });

  const {
    data: pendudukData,
    isLoading: isPendudukLoading,
    error: pendudukError,
  } = useQuery({
    queryKey: ["penduduk", user?.email],
    queryFn: () => getPendudukByCreatedBy(user?.email || ""),
    enabled: !!user?.email,
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="px-8 md:px-16 lg:px-32 py-8 border-green-500 border-b">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Preview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mx-auto px-8 md:px-16 lg:px-32 py-8">
        <h1 className="mb-6 font-bold text-gray-900 text-2xl">
          Data yang Dibuat oleh Anda
        </h1>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <h2 className="mb-4 font-semibold text-gray-800 text-lg">
              Kartu Keluarga
            </h2>
            <Link href="/preview/kartu-keluarga/add">
              <Button>
                <PlusCircle className="w-4 h-4" />
                Tambah Kartu Keluarga
              </Button>
            </Link>
          </div>
          {isKKLoading ? (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="rounded-lg w-full h-40" />
              ))}
            </div>
          ) : kkError || !kkData?.success ? (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {kkError?.message ||
                  kkData?.message ||
                  "Gagal memuat data kartu keluarga"}
              </AlertDescription>
            </Alert>
          ) : kkData?.data?.length === 0 ? (
            <Alert>
              <AlertTitle>Tidak Ada Data</AlertTitle>
              <AlertDescription>
                Tidak ada kartu keluarga yang dibuat oleh Anda.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {kkData?.data?.map((kk) => (
                <Card
                  key={kk.id}
                  className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-semibold text-gray-900 text-lg">
                      Kartu Keluarga
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 -mt-4">
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Kepala Keluarga:</span>{" "}
                      {kk.namaKepalaKeluarga}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Alamat:</span> {kk.alamat}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Banjar:</span> {kk.banjar}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Tanggal Penerbitan:</span>{" "}
                      {kk.tanggalPenerbitan}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-gray-800 text-lg">Penduduk</h2>
          {isPendudukLoading ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>Tanggal Lahir</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>Alamat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="w-32 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-40 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-24 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-20 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-48 h-4" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : pendudukError || !pendudukData?.success ? (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {pendudukError?.message ||
                  pendudukData?.message ||
                  "Gagal memuat data penduduk"}
              </AlertDescription>
            </Alert>
          ) : pendudukData?.data?.length === 0 ? (
            <Alert>
              <AlertTitle>Tidak Ada Data</AlertTitle>
              <AlertDescription>
                Tidak ada data penduduk yang dibuat oleh Anda.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>Tanggal Lahir</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>Alamat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendudukData?.data?.map((penduduk) => (
                    <TableRow key={penduduk.id}>
                      <TableCell>{penduduk.nama}</TableCell>
                      <TableCell>{penduduk.tanggalLahir}</TableCell>
                      <TableCell>{penduduk.jenisKelamin}</TableCell>
                      <TableCell>{penduduk.banjar}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
