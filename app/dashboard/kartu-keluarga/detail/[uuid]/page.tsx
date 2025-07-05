import { Heading1 } from "@/components/atoms/heading";
import DetailKartuKeluargaPage from "./detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return (
    <div className="">
      <Heading1 text="Detail Kartu Keluarga" />
      <hr className="my-4" />
      <DetailKartuKeluargaPage uuid={uuid} />
    </div>
  );
}
