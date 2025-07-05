"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/app/dashboard/kartu-keluarga/data-table";
import { useQuery } from "@tanstack/react-query";
import { getAllKK } from "@/lib/kk";
import { columns } from "./columns";

export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["kartu-keluarga"],
    queryFn: getAllKK,
    retry: false,
  });

  return (
    <div className="">
      <div className="">
        <Link href={"/dashboard/kartu-keluarga/add"}>
          <Button>
            <PlusCircle />
            Tambah Kartu Keluarga
          </Button>
        </Link>
      </div>
      <div className="mx-auto container">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <DataTable columns={columns} data={data || []} />
        )}
      </div>
    </div>
  );
}
