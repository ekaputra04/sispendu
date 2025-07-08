"use client";

import { Heading1 } from "@/components/atoms/heading";
import LoadingView from "@/components/atoms/loading-view";
import EditPendudukForm from "@/components/molecules/edit-penduduk-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getPendudukById } from "@/lib/firestore/penduduk";
import { IDataPenduduk } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";

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
      {data?.data && <EditPendudukForm data={data.data as IDataPenduduk} />}
    </div>
  );
}
