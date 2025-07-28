import EditKartuKeluargaPage from "./edit-page";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <EditKartuKeluargaPage uuid={uuid} />;
}
