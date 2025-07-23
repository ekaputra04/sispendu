import { FirestoreResponse } from "@/types/types";
import { ReportData } from "../agregatePopulationData";
import { checkAuth } from "../auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
