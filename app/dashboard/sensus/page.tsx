"use client";

import { Heading1 } from "@/components/atoms/heading";
import LoadingView from "@/components/atoms/loading-view";
import { getAllContacts } from "@/lib/firestore/contact";
import { getCurrentUser } from "@/lib/firestore/users";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { IContact, ISensus } from "@/types/types";
import { getAllSensus } from "@/lib/firestore/sensus";

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
      <Heading1 text="Data Sensus" />
      <hr className="my-4" />

      <div className="">
        <div className="relative w-full">
          {!isLoading && (
            <DataTable
              columns={columns}
              data={(data?.data as ISensus[]) || []}
            />
          )}
        </div>
      </div>
    </div>
  );
}
