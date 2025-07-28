import AddKKForm from "@/components/molecules/add-kk-form";
import Navbar from "@/components/molecules/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Page() {
  return (
    <div className="">
      <Navbar />
      <div className="px-8 md:px-16 lg:px-32 py-8 border-green-500 border-b">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/preview">Preview</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tambah Data Kartu Keluarga</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mx-auto px-8 md:px-16 lg:px-32 py-8">
        <h1 className="mb-6 font-bold text-gray-900 text-2xl">
          Tambah Data Kartu Keluarga
        </h1>
        <AddKKForm />
      </div>
    </div>
  );
}
