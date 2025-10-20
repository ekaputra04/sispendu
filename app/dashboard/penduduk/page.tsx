"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Heading1 } from "@/components/atoms/heading";
import LoadingView from "@/components/atoms/loading-view";
import { Button } from "@/components/ui/button";
import { getAllPenduduk } from "@/lib/firestore/penduduk";
import { getCurrentUser } from "@/lib/firestore/users";
import { IDataPenduduk } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

import { columnsAdmin } from "./columns-admin";
import { columnsPetugas } from "./columns-petugas";
import { DataTable } from "./data-table";
import DialogDeletePenduduk from "./dialog-delete-penduduk";

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
          <>
            {userLogin && userLogin.data?.role == "admin" ? (
              <DataTable
                columns={columnsAdmin}
                data={(data?.data as IDataPenduduk[]) || []}
              />
            ) : (
              <DataTable
                columns={columnsPetugas}
                data={(data?.data as IDataPenduduk[]) || []}
              />
            )}
          </>
        )}
      </div>

      <DialogDeletePenduduk />
    </div>
  );
}
