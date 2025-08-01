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
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/firestore/users";

export default function Page() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["penduduk"],
    queryFn: getAllPenduduk,
  });

  const { data: userLogin, isLoading: isGetUserLoading } = useQuery({
    queryKey: ["user-login"],
    queryFn: getCurrentUser,
  });

  if (
    !isGetUserLoading &&
    userLogin?.success === false &&
    userLogin.data?.role in ["admin", "petugas"]
  ) {
    router.push("/login");
  }

  return (
    <div className="">
      {isLoading && <LoadingView />}
      <div className="flex justify-between items-center">
        <Heading1 text="Data Penduduk" />
        <Link href={"/dashboard/penduduk/add"}>
          <Button className="flex justify-between items-center gap-2 text-white">
            <PlusCircle />
            <span>Tambah Data Penduduk</span>
          </Button>
        </Link>
      </div>
      <hr className="my-4" />

      <div className="relative w-full">
        {!isLoading && (
          <DataTable
            columns={columns}
            data={(data?.data as IDataPenduduk[]) || []}
          />
        )}
      </div>

      {!isLoading && (
        <p className="text-muted-foreground text-sm">
          {data && data.data?.length} Data Penduduk Ditemukan
        </p>
      )}

      <DialogDeletePenduduk />
    </div>
  );
}
