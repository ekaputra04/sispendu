import { Heading1 } from "@/components/atoms/heading";
import EditKKForm from "@/components/molecules/edit-kk-form";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return (
    <div className="">
      <Heading1 text="Edit Kartu Keluarga" />
      <hr className="my-4" />
      <EditKKForm uuid={uuid} />
    </div>
  );
}
