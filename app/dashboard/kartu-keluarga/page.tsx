"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Heading1 } from "@/components/atoms/heading";
import LoadingView from "@/components/atoms/loading-view";
import { Button } from "@/components/ui/button";
import { getAllKK } from "@/lib/firestore/kartu-keluarga";
import { getCurrentUser } from "@/lib/firestore/users";
import { useQuery } from "@tanstack/react-query";

import { columnsAdmin } from "./columns-admin";
import { columnsPetugas } from "./columns-petugas";
import { DataTable } from "./data-table";
import DialogDeleteKK from "./dialog-delete-kk";

export default function Page() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["kartu-keluarga"],
    queryFn: getAllKK,
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
        <Heading1 text="Data Kartu Keluarga" />

        <Link href={"/dashboard/kartu-keluarga/add"}>
          <Button className="flex items-center gap-2 text-white">
            <PlusCircle />
            <span>Tambah Kartu Keluarga</span>
          </Button>
        </Link>
      </div>
      <hr className="my-4" />

      {error && <p>{error.message}</p>}

      <div className="mx-auto container">
        {!isLoading && (
          <>
            {userLogin && userLogin.data?.role === "admin" ? (
              <DataTable columns={columnsAdmin} data={data?.data || []} />
            ) : (
              <DataTable columns={columnsPetugas} data={data?.data || []} />
            )}
          </>
        )}
      </div>

      <DialogDeleteKK />
    </div>
  );
}
