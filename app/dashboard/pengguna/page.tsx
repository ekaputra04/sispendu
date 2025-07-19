"use client";

import { Heading1 } from "@/components/atoms/heading";
import { getAllUsers } from "@/lib/firestore/users";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { IDataPengguna } from "@/types/types";
import LoadingView from "@/components/atoms/loading-view";

export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pengguna"],
    queryFn: getAllUsers,
  });

  return (
    <div className="">
      {isLoading && <LoadingView />}
      <Heading1 text="Daftar Pengguna Sistem" />
      <hr className="my-4" />
      <div className="relative w-full">
        {!isLoading && (
          <DataTable
            columns={columns}
            data={(data?.data as IDataPengguna[]) || []}
          />
        )}
      </div>
    </div>
  );
}
