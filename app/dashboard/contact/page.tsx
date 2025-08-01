"use client";

import { Heading1 } from "@/components/atoms/heading";
import LoadingView from "@/components/atoms/loading-view";
import { getAllContacts } from "@/lib/firestore/contact";
import { getCurrentUser } from "@/lib/firestore/users";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { IContact } from "@/types/types";

export default function Page() {
  const router = useRouter();

  const { data: userLogin, isLoading: isGetUserLoading } = useQuery({
    queryKey: ["user-login"],
    queryFn: getCurrentUser,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["contact"],
    queryFn: getAllContacts,
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
      <Heading1 text="Data Kontak" />
      <hr className="my-4" />

      <div className="">
        <div className="relative w-full">
          {!isLoading && (
            <DataTable
              columns={columns}
              data={(data?.data as IContact[]) || []}
            />
          )}
        </div>
        {!isLoading && (
          <p className="text-muted-foreground text-sm">
            {data && data.data?.length} Data Pesan Ditemukan
          </p>
        )}
      </div>
    </div>
  );
}
