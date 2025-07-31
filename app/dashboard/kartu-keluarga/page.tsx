"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAllKK } from "@/lib/firestore/kartu-keluarga";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import LoadingView from "@/components/atoms/loading-view";
import DialogDeleteKK from "./dialog-delete-kk";
import { Heading1 } from "@/components/atoms/heading";

export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["kartu-keluarga"],
    queryFn: getAllKK,
  });

  return (
    <div className="">
      {isLoading && <LoadingView />}
      <div className="flex justify-between items-center">
        <Heading1 text="Data Kartu Keluarga" />

        <Link href={"/dashboard/kartu-keluarga/add"}>
          <Button className="flex items-center gap-2 text-white">
            <PlusCircle />
            <span>Tambah Kartu Keluarga</span>
          </Button>
        </Link>
      </div>
      <hr className="my-4" />

      <div className="mx-auto container">
        {!isLoading && <DataTable columns={columns} data={data?.data || []} />}
      </div>
      <DialogDeleteKK />
    </div>
  );
}
