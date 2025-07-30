import { getDocs, collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase-init";
import { checkAuth } from "@/lib/auth";
import { FirestoreResponse, IReportKK } from "@/types/types";

const banjars = ["Bebalang", "Tegal", "Sedit", "Gancan", "Sembung", "Petak"];

export async function generateKKReport(): Promise<
  FirestoreResponse<IReportKK>
> {
  try {
    await checkAuth();

    const querySnapshot = await getDocs(collection(db, "kartu-keluarga"));

    const reportData: {
      [key: string]: { totalKK: number; totalAnggota: number };
    } = {};
    banjars.forEach((banjar) => {
      reportData[banjar] = { totalKK: 0, totalAnggota: 0 };
    });
    reportData["Total"] = { totalKK: 0, totalAnggota: 0 };

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const banjar = data.banjar as string;
      const anggotaKeluarga = data.anggotaKeluarga
        ? Array.isArray(data.anggotaKeluarga)
          ? data.anggotaKeluarga.length
          : Number(data.anggotaKeluarga)
        : 0;

      if (banjars.includes(banjar)) {
        reportData[banjar].totalKK += 1;
        reportData[banjar].totalAnggota += anggotaKeluarga;
        reportData["Total"].totalKK += 1;
        reportData["Total"].totalAnggota += anggotaKeluarga;
      }
    });

    const groups = Object.entries(reportData).map(
      ([name, { totalKK, totalAnggota }]) => ({
        name,
        totalKK: {
          count: totalKK,
          percentage:
            reportData["Total"].totalKK > 0
              ? (totalKK / reportData["Total"].totalKK) * 100
              : 0,
        },
        totalAnggota: {
          count: totalAnggota,
          percentage:
            reportData["Total"].totalAnggota > 0
              ? (totalAnggota / reportData["Total"].totalAnggota) * 100
              : 0,
        },
      })
    );

    const report: IReportKK = {
      category: "banjar",
      groups,
      createdAt: Timestamp.now(),
    };

    await addDoc(collection(db, "report-kk"), report);

    return {
      success: true,
      message: "Berhasil membuat dan menyimpan laporan kartu keluarga",
      data: report,
    };
  } catch (error: any) {
    console.error("Gagal membuat laporan kartu keluarga:", error);
    return {
      success: false,
      message: error.message || "Gagal membuat laporan kartu keluarga",
      errorCode: error.code || "unknown",
    };
  }
}
