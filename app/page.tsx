"use client";

import Footer from "@/components/atoms/footer";
import LoadingView from "@/components/atoms/loading-view";
import HeroView from "@/components/molecules/hero-view";
import ReportView from "@/components/molecules/report-view";
import { getCurrentUser } from "@/lib/firestore/users";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  return (
    <div className="">
      <HeroView />
      <div className="px-8 md:px-16 lg:px-32 py-16">
        <h1 className="font-semibold text-2xl text-center">
          Data Statistik Penduduk
        </h1>
        <div className="bg-primary mx-auto my-6 w-32 h-1"></div>
        <p className="mb-8 font-semibold text-center">
          Jumlah dan Persentase Penduduk di Kelurahan Bebalang
        </p>
        <ReportView />
      </div>
      <Footer />
    </div>
  );
}
