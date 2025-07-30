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
import { Card, CardContent } from "@/components/ui/card";

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
              Sekapur Sirih dari Lurah Bebalang
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-accent-foreground">
              Sambutan hangat dari Lurah Bebalang untuk menyapa warga dan
              pengguna Sistem Data Kependudukan, mengusung semangat keramahan
              dan gotong royong.
            </p>
          </div>

          {/* Sambutan */}
          <div className="mb-12">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="leading-relaxed text-accent-foreground">
                  Om Swastiastu
                  <br />
                  <br />
                  Dengan penuh rasa syukur, kami memperkenalkan Sistem Data
                  Kependudukan yang dirancang untuk mempermudah pengelolaan data
                  warga Kelurahan Bebalang. Kami senantiasa berkomitmen untuk
                  menjaga keakuratan data penduduk. Semangat gotong royong dan
                  keramahan, sebagaimana disimbolkan oleh tradisi sekapur sirih,
                  menjadi landasan kami dalam melayani masyarakat.
                  <br />
                  <br />
                  Sistem ini memungkinkan pengelolaan data yang efisien, laporan
                  berbasis banjar, dan validasi data yang akurat. Kami berharap
                  platform ini dapat menjadi alat yang bermanfaat bagi
                  masyarakat Kelurahan Bebalang agar lebih terorganisir.
                  <br />
                  <br />
                  Om Shanti Shanti Shanti Om
                  <br />
                  <br />
                  Lurah Bebalang
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
