"use client";

import { Heading1 } from "@/components/atoms/heading";
import LoadingView from "@/components/atoms/loading-view";
import EditKKForm from "@/components/molecules/edit-kk-form";
import Navbar from "@/components/molecules/navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getKKById } from "@/lib/firestore/kartu-keluarga";
import { IKartuKeluarga } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface EditKartuKeluargaPageProps {
  uuid: string;
}

export default function EditKartuKeluargaPage({
  uuid,
}: EditKartuKeluargaPageProps) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["kartu-keluarga", uuid],
    queryFn: () => getKKById(uuid),
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
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/preview">Preview</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Data Kartu Keluarga</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="my-8 px-8 md:px-16 lg:px-32">
        <Heading1 text="Edit Data Kartu Keluarga" />
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
          <EditKKForm data={data.data as IKartuKeluarga} redirectTo="preview" />
        )}
      </div>
    </div>
  );
}
