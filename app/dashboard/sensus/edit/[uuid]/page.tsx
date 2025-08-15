import EditSensusPage from "./edit-page";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <EditSensusPage uuid={uuid} />;
}
