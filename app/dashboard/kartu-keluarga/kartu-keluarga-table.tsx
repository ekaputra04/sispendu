"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function KartuKeluargaPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["kartu-keluarga"],
    queryFn: async () => {
      const response = await axios.get("/api/kartu-keluarga");
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    },
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
