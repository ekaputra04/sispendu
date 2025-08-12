"use client";

import { Heading1 } from "@/components/atoms/heading";
import LoadingView from "@/components/atoms/loading-view";
import Navbar from "@/components/molecules/navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IDataPenduduk } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getPendudukById } from "@/lib/firestore/penduduk";
import EditPendudukForm from "@/components/molecules/edit-penduduk-form";
import Link from "next/link";

interface EditPendudukPageProps {
  uuid: string;
}

export default function EditPendudukPage({ uuid }: EditPendudukPageProps) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["penduduk", uuid],
    queryFn: () => getPendudukById(uuid),
    retry: false,
  });
  return (
    <div className="">
      {isLoading && <LoadingView />}
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
              <Link href="/preview">
                <BreadcrumbPage>Preview</BreadcrumbPage>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Data Penduduk</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="my-8 px-8 md:px-16 lg:px-32">
        <Heading1 text="Edit Data Penduduk" />
        <hr className="my-4" />
        {isError && error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Gagal mendapatkan data.</AlertTitle>
            <AlertDescription>
              <p>{error.message}</p>
            </AlertDescription>
          </Alert>
        )}
        {data?.data && (
          <EditPendudukForm
            data={data.data as IDataPenduduk}
            redirectTo="preview"
          />
        )}
      </div>
    </div>
  );
}
