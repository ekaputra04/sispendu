"use client";

import Navbar from "./navbar";

export default function HeroView() {
  return (
    <div className="">
      <div className="relative h-[70vh]">
        <Navbar isInHeroView={true} />

        <div className="relative flex justify-center items-center h-full overflow-hidden">
          <div className="-z-10 absolute inset-0">
            <img
              src="/images/bg-sawah.jpg"
              className="w-full h-full object-center object-cover"
              alt="background"
            />
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>

          <div className="z-10 space-y-4 px-4 text-center">
            <h1 className="font-bold text-white text-2xl md:text-3xl">
              SELAMAT DATANG
            </h1>
            <h2 className="font-semibold text-white text-xl md:text-2xl">
              Sistem Informasi Pendataan Penduduk
            </h2>
            <h3 className="font-normal text-white text-lg md:text-xl">
              Kelurahan Bebalang
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
