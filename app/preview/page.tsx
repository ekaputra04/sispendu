"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/molecules/navbar";
import { getKKByCreatedBy } from "@/lib/firestore/kartu-keluarga";
import { useUserStore } from "@/store/useUserStore";
import { AlertCircle, Eye, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { getPendudukByCreatedBy } from "@/lib/firestore/penduduk";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import DialogDeleteKK from "../dashboard/kartu-keluarga/dialog-delete-kk";
import { useKKSelectedForDelete } from "@/store/useKKSelectedForDelete";
import { IDataPenduduk, IKartuKeluarga } from "@/types/types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import DialogDeletePenduduk from "./dialog-delete-penduduk";
import LoadingView from "@/components/atoms/loading-view";
import Footer from "@/components/atoms/footer";
import { Heading1 } from "@/components/atoms/heading";

export default function PreviewPage() {
  const { user } = useUserStore();
  const { setKartuKeluarga, setIsOpen } = useKKSelectedForDelete();

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

  async function handleOpenDialog(kk: IKartuKeluarga) {
    setKartuKeluarga(kk);
    setIsOpen(true);
  }

  return (
    <>
      {(isKKLoading || isPendudukLoading) && <LoadingView />}
      <div className="min-h-screen">
        <Navbar />
        <div className="px-8 md:px-16 lg:px-32 py-8 border-green-500 border-b">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/">
                  <BreadcrumbPage>Beranda</BreadcrumbPage>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Preview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="mx-auto px-8 md:px-16 lg:px-32 py-8">
          <Heading1 text="Data yang Anda Buat" />
          <hr className="my-4" />

          <section className="mb-12">
            <div className="flex justify-between items-center mb-2">
              <h2 className="mb-4 font-semibold text-xl text-accent-foreground">
                Kartu Keluarga
              </h2>
              <Link href="/preview/kartu-keluarga/add">
                <Button className="text-white">
                  <PlusCircle className="w-4 h-4" />
                  Tambah Data Kartu Keluarga
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
                    <CardHeader className="flex justify-between items-center">
                      <Link
                        href={`/preview/kartu-keluarga/detail/${kk.id}`}
                        className="group">
                        <div className="flex items-center gap-2">
                          <CardTitle className="font-semibold text-lg group-hover:underline">
                            Kartu Keluarga
                          </CardTitle>
                          <Button variant={"ghost"} size={"icon"}>
                            <Eye />
                          </Button>
                        </div>
                      </Link>
                      <div className="flex gap-2">
                        <Link href={`/preview/kartu-keluarga/edit/${kk.id}`}>
                          <Button
                            variant="outline"
                            className={ButtonOutlineGreen}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant={"destructive"}
                          onClick={() => handleOpenDialog(kk)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 -mt-4">
                      <p className="text-muted-foreground text-sm">
                        <span className="font-medium">Kepala Keluarga:</span>{" "}
                        {kk.namaKepalaKeluarga.toUpperCase()}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <span className="font-medium">Alamat:</span>{" "}
                        {kk.alamat.toUpperCase()}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <span className="font-medium">Banjar:</span>{" "}
                        {kk.banjar.toUpperCase()}
                      </p>
                      <p className="text-muted-foreground text-sm">
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
            <div className="flex justify-between items-center mb-2">
              <h2 className="mb-4 font-semibold text-xl text-accent-foreground">
                Penduduk
              </h2>
              <Link href="/preview/penduduk/add">
                <Button className="text-white">
                  <PlusCircle className="w-4 h-4" />
                  Tambah Data Penduduk
                </Button>
              </Link>
            </div>
            <div className="relative w-full">
              {!isPendudukLoading && (
                <DataTable
                  columns={columns}
                  data={(pendudukData?.data as IDataPenduduk[]) || []}
                />
              )}
            </div>
            {!isPendudukLoading && (
              <p className="text-muted-foreground text-sm">
                {pendudukData && pendudukData.data?.length} Data Penduduk
                Ditemukan
              </p>
            )}
          </section>
        </div>

        <DialogDeletePenduduk />
        <DialogDeleteKK />
      </div>
      <Footer />
    </>
  );
}
