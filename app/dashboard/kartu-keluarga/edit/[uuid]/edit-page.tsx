"use client";

import { Heading1 } from "@/components/atoms/heading";
import LoadingView from "@/components/atoms/loading-view";
import EditKKForm from "@/components/molecules/edit-kk-form";
import EditPendudukForm from "@/components/molecules/edit-penduduk-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getKKById } from "@/lib/firestore/kartu-keluarga";
import { IKartuKeluarga } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";

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
      {data?.data && <EditKKForm data={data.data as IKartuKeluarga} />}
    </div>
  );
}
