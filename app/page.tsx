"use client";

import HeroView from "@/components/molecules/hero-view";
import ReportView from "@/components/molecules/report-view";

export default function Home() {
  // useEffect(() => {
  //   async function validateSession() {
  //     try {
  //       const sessionDecrypted = await decrypt(session);
  //       console.log("Session decrypted:", sessionDecrypted);

  //       const now = Date.now();
  //       if (sessionDecrypted) {
  //         const expiresAtMs = sessionDecrypted?.expiresAt
  //           ? Date.parse(sessionDecrypted?.expiresAt as string)
  //           : Infinity;
  //         const expMs = sessionDecrypted.exp
  //           ? sessionDecrypted.exp * 1000
  //           : Infinity;

  //         if (expiresAtMs < now || expMs < now) {
  //           console.log("Session expired:", {
  //             expiresAt: sessionDecrypted.expiresAt,
  //             exp: sessionDecrypted.exp,
  //             now,
  //           });
  //           clearSession();
  //           clearUser();
  //           setIsSessionValid(false);
  //           router.push("/login");
  //           return;
  //         }
  //       }
  //       setIsSessionValid(false);
  //     } catch (error) {
  //       console.error("Error decrypting session:", error);
  //       clearSession();
  //       clearUser();
  //       setIsSessionValid(false);
  //       router.push("/login");
  //     }
  //   }

  //   validateSession();
  // }, [session]);

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
    </div>
  );
}
