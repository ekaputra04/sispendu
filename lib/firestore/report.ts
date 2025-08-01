import { FirestoreResponse, IReportKK } from "@/types/types";
import { IReport, ReportData } from "../agregatePopulationData";
import { checkAuth } from "../auth";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase-init";

export async function saveReport(
  reportData: ReportData[]
): Promise<FirestoreResponse<void>> {
  try {
    await checkAuth();

    await addDoc(collection(db, "report"), {
      data: reportData,
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      message: "Laporan berhasil disimpan",
    };
  } catch (error: any) {
    console.error("Gagal menyimpan laporan:", error);
    return {
      success: false,
      message: error.message || "Gagal menyimpan laporan",
      errorCode: error.code || "unknown",
    };
  }
}

export const fetchLatestReport = async (): Promise<IReport> => {
  const reportQuery = query(
    collection(db, "report"),
    orderBy("createdAt", "desc"),
    limit(1)
  );
  const reportSnapshot = await getDocs(reportQuery);
  if (!reportSnapshot.empty) {
    return reportSnapshot.docs[0].data() as IReport;
  }
  return {} as IReport;
};

export async function fetchLatestReportKK(): Promise<
  FirestoreResponse<IReportKK>
> {
  try {
    const q = query(
      collection(db, "report-kk"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: "Tidak ada laporan kartu keluarga ditemukan",
        errorCode: "no-data",
      };
    }

    const doc = querySnapshot.docs[0];
    const data = { ...doc.data() } as IReportKK;

    return {
      success: true,
      message: "Berhasil mengambil laporan kartu keluarga terbaru",
      data,
    };
  } catch (error: any) {
    console.error("Gagal mengambil laporan kartu keluarga:", error);
    return {
      success: false,
      message: error.message || "Gagal mengambil laporan kartu keluarga",
      errorCode: error.code || "unknown",
    };
  }
}
