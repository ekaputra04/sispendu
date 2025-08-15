"use client";

import { Heading1 } from "@/components/atoms/heading";
import LoadingView from "@/components/atoms/loading-view";
import { getCurrentUser } from "@/lib/firestore/users";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ISensus } from "@/types/types";
import { getAllSensus } from "@/lib/firestore/sensus";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import DialogDeleteSensus from "./dialog-delete-sensus";

export default function Page() {
  const router = useRouter();

  const { data: userLogin, isLoading: isGetUserLoading } = useQuery({
    queryKey: ["user-login"],
    queryFn: getCurrentUser,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["sensus"],
    queryFn: getAllSensus,
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
        <Heading1 text="Data Sensus" />
        <Link href={"/dashboard/sensus/add"}>
          <Button className="flex justify-between items-center gap-2 text-white">
            <PlusCircle />
            <span>Tambah Data Sensus</span>
          </Button>
        </Link>
      </div>
      <hr className="my-4" />

      {error && <p className="text-red-500 text-sm">{error.message}</p>}

      <div className="relative w-full">
        {!isLoading && (
          <DataTable columns={columns} data={(data?.data as ISensus[]) || []} />
        )}
      </div>
      <DialogDeleteSensus />
    </div>
  );
}
