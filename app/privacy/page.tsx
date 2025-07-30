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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, Mail } from "lucide-react";

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
                <BreadcrumbPage>Sekapur Sirih</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="">
        <div className="mx-auto px-8 md:px-16 lg:px-32 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-bold text-primary text-3xl md:text-4xl">
              Kebijakan Privasi
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-accent-foreground">
              Kami di Kelurahan Bebalang berkomitmen untuk melindungi privasi
              data masyarakat. Kebijakan ini menjelaskan bagaimana kami
              mengelola dan menjaga keamanan informasi Anda.
            </p>
          </div>

          {/* Kebijakan Privasi */}
          <div className="space-y-6 mb-12">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="font-semibold text-lg">
                  Pengumpulan Data
                </CardTitle>
                <CardDescription>
                  Jenis data yang kami kumpulkan untuk mendukung pengelolaan
                  demografis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Kami mengumpulkan data pribadi yang diperlukan untuk Sistem
                  Data Kependudukan, seperti nama, alamat, tanggal lahir, dan
                  informasi kartu keluarga. Selain itu, melalui form kontak,
                  kami mengumpulkan nama, alamat email, dan pesan yang Anda
                  kirimkan secara sukarela untuk keperluan komunikasi.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="font-semibold text-lg">
                  Penggunaan Data
                </CardTitle>
                <CardDescription>
                  Bagaimana kami menggunakan data Anda untuk keperluan
                  pelayanan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Data yang dikumpulkan digunakan untuk mengelola informasi
                  penduduk, menghasilkan laporan berbasis banjar, dan memastikan
                  keakuratan data demografis. Data dari form kontak digunakan
                  untuk menjawab pertanyaan atau saran Anda, serta meningkatkan
                  pelayanan kami di Kelurahan Bebalang.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="font-semibold text-lg">
                  Keamanan Data
                </CardTitle>
                <CardDescription>
                  Langkah-langkah kami untuk menjaga keamanan informasi Anda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Kami menerapkan langkah-langkah keamanan teknis dan organisasi
                  untuk melindungi data Anda dari akses tidak sah, kehilangan,
                  atau penyalahgunaan. Data disimpan dalam sistem yang aman, dan
                  hanya staf yang berwenang yang dapat mengaksesnya untuk
                  keperluan resmi.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="font-semibold text-lg">
                  Hak Pengguna
                </CardTitle>
                <CardDescription>
                  Hak Anda terkait data pribadi yang kami kelola.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Anda berhak untuk mengakses, memperbarui, atau meminta
                  penghapusan data pribadi Anda. Jika Anda memiliki pertanyaan
                  atau permintaan terkait data, silakan hubungi kami melalui
                  informasi kontak yang tersedia di halaman ini.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
