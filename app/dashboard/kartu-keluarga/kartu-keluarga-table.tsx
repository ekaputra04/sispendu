"use client";

import { getAllKK } from "@/lib/kk";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function KartuKeluargaPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["kartu-keluarga"],
    queryFn: getAllKK,
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    toast.error(error.message || "Gagal memuat data kartu keluarga");
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="">
      <div className="">{JSON.stringify(data, null, 2)}</div>
    </div>
  );
}
