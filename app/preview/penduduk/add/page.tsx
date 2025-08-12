import { Heading1 } from "@/components/atoms/heading";
import AddKKForm from "@/components/molecules/add-kk-form";
import AddPendudukForm from "@/components/molecules/add-penduduk-form";
import Navbar from "@/components/molecules/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function Page() {
  return (
    <div className="">
      <Navbar />
      <div className="px-8 md:px-16 lg:px-32 py-8 border-green-500 border-b">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/">
                <BreadcrumbPage>Beranda</BreadcrumbPage>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href="/preview">
                <BreadcrumbPage>Preview</BreadcrumbPage>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tambah Data Penduduk</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mx-auto px-8 md:px-16 lg:px-32 py-8">
        <Heading1 text="Tambah Data Penduduk" />
        <hr className="my-4" />
        <AddPendudukForm redirectTo="preview" />
      </div>
    </div>
  );
}
