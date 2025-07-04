"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/app/dashboard/kartu-keluarga/data-table";
import { useQuery } from "@tanstack/react-query";
import { getAllKK } from "@/lib/kk";
import { IKartuKeluarga } from "@/types/types";
import { columns } from "./columns";

async function getData(): Promise<IKartuKeluarga[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      rw: "Voluptate sint est ",
      provinsi: "Quos non veniam con",
      namaKepalaKeluarga: "Consequatur est ips",
      rt: "Provident consequat",
      tanggalPenerbitan: "2017-11-22",
      desa: "Voluptatem Nam nisi ",
      noKK: "Sed est ut ut conseq",
      kecamatan: "Voluptas laudantium",
      alamat: "Officia qui dolore r",
      kodePos: "Voluptatem maxime t",
      kabupaten: "Id dolor sunt itaqu",
    },
    {
      id: "2",
      noKK: "Eos possimus dolore",
      kabupaten: "Reprehenderit occae",
      provinsi: "Error exercitationem",
      namaKepalaKeluarga: "Ut amet eum odio eu",
      rw: "Ex rerum vero occaec",
      rt: "Facilis omnis conseq",
      alamat: "Amet nihil officia ",
      kodePos: "Autem qui cumque Nam",
      kecamatan: "Obcaecati corrupti ",
      tanggalPenerbitan: "2017-11-22",
      desa: "In ipsum quisquam a",
    },
  ];
}

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
