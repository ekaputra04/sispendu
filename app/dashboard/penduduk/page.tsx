"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getAllPenduduk } from "@/lib/firestore/penduduk";
import LoadingView from "@/components/atoms/loading-view";
import { IDataPenduduk } from "@/types/types";
import DialogDeletePenduduk from "./dialog-delete-penduduk";
import { Heading1 } from "@/components/atoms/heading";

export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["penduduk"],
    queryFn: getAllPenduduk,
  });

  return (
    <div className="">
      {isLoading && <LoadingView />}
      <div className="flex justify-between items-center mb-2">
        <Heading1 text="Data Penduduk" />
        <Link href={"/dashboard/penduduk/add"}>
          <Button className="flex justify-between items-center gap-2 text-white">
            <PlusCircle />
            <span>Tambah Data Penduduk</span>
          </Button>
        </Link>
      </div>
      <div className="relative w-full">
        {!isLoading && (
          <DataTable
            columns={columns}
            data={(data?.data as IDataPenduduk[]) || []}
          />
        )}
      </div>
      <DialogDeletePenduduk />
    </div>
  );
}
