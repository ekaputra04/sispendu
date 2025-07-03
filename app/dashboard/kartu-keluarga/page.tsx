import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { columns, Payment } from "./columns";
import { DataTable } from "@/app/dashboard/kartu-keluarga/data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed522",
      amount: 12,
      status: "pending",
      email: "asik@example.com",
    },
    // ...
  ];
}

export default async function Page() {
  const data = await getData();

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
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
