import Footer from "@/components/atoms/footer";
import Navbar from "@/components/molecules/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function Page() {
  return (
    <>
      <div className="">
        <Navbar />
        <div className="px-8 md:px-16 lg:px-32 py-8 border-green-500 border-b">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tentang</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="">
        <div>
          <div className="mx-auto px-8 md:px-16 lg:px-32 py-16">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="font-bold text-primary text-3xl md:text-4xl">
                Tentang Sistem Data Kependudukan
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-accent-foreground">
                Sistem Data Kependudukan adalah platform modern untuk mengelola
                data penduduk dan kartu keluarga dengan efisien, akurat, dan
                aman. Kami membantu komunitas lokal untuk mengelola informasi
                demografis dengan mudah.
              </p>
            </div>

            {/* Fitur Utama */}
            <div>
              <h2 className="mb-6 font-semibold text-primary text-2xl text-center">
                Fitur Utama
              </h2>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-semibold text-lg">
                      Pengelolaan Kartu Keluarga
                    </CardTitle>
                    <CardDescription>
                      Kelola data kartu keluarga dengan mudah, termasuk
                      informasi anggota dan status hubungan dalam keluarga.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-semibold text-lg">
                      Laporan Berbasis Banjar
                    </CardTitle>
                    <CardDescription>
                      Hasilkan laporan terperinci tentang jumlah penduduk dan
                      kartu keluarga per banjar untuk analisis demografis.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-semibold text-lg">
                      Validasi Data
                    </CardTitle>
                    <CardDescription>
                      Pastikan data akurat dengan validasi otomatis untuk
                      informasi seperti nama, tanggal lahir, dan
                      kewarganegaraan.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
