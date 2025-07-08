import EditPendudukPage from "./edit-page";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <EditPendudukPage uuid={uuid} />;
}
