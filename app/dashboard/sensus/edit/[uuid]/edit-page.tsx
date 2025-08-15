"use client";

import { Heading1 } from "@/components/atoms/heading";
import LoadingView from "@/components/atoms/loading-view";
import EditKKForm from "@/components/molecules/edit-kk-form";
import EditSensusForm from "@/components/molecules/edit-sensus-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getKKById } from "@/lib/firestore/kartu-keluarga";
import { getSensusById } from "@/lib/firestore/sensus";
import { IKartuKeluarga, ISensus } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";

interface EditSensusPageProps {
  uuid: string;
}

export default function EditSensusPage({ uuid }: EditSensusPageProps) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["sensus", uuid],
    queryFn: () => getSensusById(uuid),
    retry: false,
  });
  return (
    <div className="">
      {isLoading && <LoadingView />}
      <Heading1 text="Edit Data Sensus" />
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
      {data?.data && <EditSensusForm data={data.data as ISensus} />}
    </div>
  );
}
