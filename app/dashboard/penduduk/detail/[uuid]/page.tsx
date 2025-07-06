import DetailPendudukPage from "@/app/dashboard/kartu-keluarga/detail/[uuid]/detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <DetailPendudukPage uuid={uuid} />;
}
