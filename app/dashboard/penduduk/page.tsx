"use client";

import { Button } from "@/components/ui/button";
import { getAllKK } from "@/lib/kk";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["penduduk"],
    queryFn: getAllKK,
    retry: false,
  });

  return (
    <div className="">
      <div className="">
        <Link href={"/dashboard/penduduk/add"}>
          <Button>
            <PlusCircle />
            Tambah Data Penduduk
          </Button>
        </Link>
      </div>
      <div className="mx-auto container">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <DataTable columns={columns} data={[]} />
        )}
      </div>
    </div>
  );
}
