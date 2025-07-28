import DetailPendudukPage from "./detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <DetailPendudukPage uuid={uuid} />;
}
