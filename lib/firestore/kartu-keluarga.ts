import { db } from "@/config/firebase-init";
import { FirestoreResponse, IKartuKeluarga } from "@/types/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { checkAuth } from "../auth";

// Mendapatkan semua kartu keluarga
export async function getAllKK(): Promise<FirestoreResponse<IKartuKeluarga[]>> {
  try {
    await checkAuth(); // Memeriksa autentikasi
    const querySnapshot = await getDocs(collection(db, "kartu-keluarga"));
    const data: IKartuKeluarga[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as IKartuKeluarga);
    });
    return {
      success: true,
      message: "Berhasil mengambil data kartu keluarga",
      data,
    };
  } catch (error: any) {
    console.error("Gagal mengambil data kartu keluarga:", error);
    return {
      success: false,
      message: error.message || "Gagal mengambil data kartu keluarga",
      errorCode: error.code || "unknown",
    };
  }
}

// Mendapatkan kartu keluarga berdasarkan ID
export async function getKKById(
  kkId: string
): Promise<FirestoreResponse<IKartuKeluarga | null>> {
  try {
    if (!kkId) {
      throw new Error("ID kartu keluarga diperlukan");
    }

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        kkId
      )
    ) {
      throw new Error("ID tidak valid");
    }

    await checkAuth(); // Memeriksa autentikasi
    const docRef = doc(db, "kartu-keluarga", kkId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return {
        success: false,
        message: `Kartu keluarga dengan ID ${kkId} tidak ditemukan`,
        data: null,
      };
    }
    return {
      success: true,
      message: "Berhasil mengambil data kartu keluarga",
      data: { id: docSnap.id, ...docSnap.data() } as IKartuKeluarga,
    };
  } catch (error: any) {
    console.error("Gagal mengambil kartu keluarga:", error);
    return {
      success: false,
      message: error.message || "Gagal mengambil kartu keluarga",
      errorCode: error.code || "unknown",
      data: null,
    };
  }
}

// Membuat kartu keluarga baru
export async function createKK({
  kk,
}: {
  kk: IKartuKeluarga;
}): Promise<FirestoreResponse<void>> {
  try {
    if (!kk.id) {
      throw new Error("ID kartu keluarga diperlukan");
    }
    await checkAuth(); // Memeriksa autentikasi
    await setDoc(doc(db, "kartu-keluarga", kk.id), kk);
    return {
      success: true,
      message: "Kartu keluarga berhasil dibuat",
    };
  } catch (error: any) {
    console.error("Gagal membuat kartu keluarga:", error);
    return {
      success: false,
      message: error.message || "Gagal membuat kartu keluarga",
      errorCode: error.code || "unknown",
    };
  }
}

// Memperbarui kartu keluarga
export async function updateKK(
  kkId: string,
  kk: IKartuKeluarga
): Promise<FirestoreResponse<void>> {
  try {
    if (!kkId) {
      throw new Error("ID kartu keluarga diperlukan");
    }
    await checkAuth(); // Memeriksa autentikasi
    const docRef = doc(db, "kartu-keluarga", kkId);
    await updateDoc(docRef, { ...kk });
    return {
      success: true,
      message: "Kartu keluarga berhasil diperbarui",
    };
  } catch (error: any) {
    console.error("Gagal memperbarui kartu keluarga:", error);
    return {
      success: false,
      message: error.message || "Gagal memperbarui kartu keluarga",
      errorCode: error.code || "unknown",
    };
  }
}

// Menghapus kartu keluarga
export async function deleteKK(kkId: string): Promise<FirestoreResponse<void>> {
  try {
    if (!kkId) {
      throw new Error("ID kartu keluarga diperlukan");
    }
    await checkAuth(); // Memeriksa autentikasi
    const docRef = doc(db, "kartu-keluarga", kkId);
    await deleteDoc(docRef);
    return {
      success: true,
      message: "Kartu keluarga berhasil dihapus",
    };
  } catch (error: any) {
    console.error("Gagal menghapus kartu keluarga:", error);
    return {
      success: false,
      message: error.message || "Gagal menghapus kartu keluarga",
      errorCode: error.code || "unknown",
    };
  }
}
