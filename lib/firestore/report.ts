import { FirestoreResponse } from "@/types/types";
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
// export const fetchLatestReport = async (): Promise<ReportData[]> => {
//   const reportQuery = query(
//     collection(db, "report"),
//     orderBy("createdAt", "desc"),
//     limit(1)
//   );
//   const reportSnapshot = await getDocs(reportQuery);
//   if (!reportSnapshot.empty) {
//     return reportSnapshot.docs[0].data().data as ReportData[];
//   }
//   return [];
// };
