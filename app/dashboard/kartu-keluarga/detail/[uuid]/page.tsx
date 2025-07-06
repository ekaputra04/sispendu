import { Heading1 } from "@/components/atoms/heading";
import DetailKartuKeluargaPage from "./detail-page";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ButtonOutlineGreen } from "@/consts/buttonCss";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <Heading1 text="Detail Kartu Keluarga" />
        <Link href={"/dashboard/kartu-keluarga/edit/" + uuid}>
          <Button variant={"outline"} className={ButtonOutlineGreen}>
            <Pencil />
            Edit Kartu Keluarga
          </Button>
        </Link>
      </div>
      <hr className="my-4" />
      <DetailKartuKeluargaPage uuid={uuid} />
    </div>
  );
}
