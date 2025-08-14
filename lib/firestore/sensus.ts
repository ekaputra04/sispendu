import { db } from "@/config/firebase-init";
import { FirestoreResponse, ISensus } from "@/types/types";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const SENSUS_COLLECTION = "sensus";

export async function createSensus({
  sensus,
}: {
  sensus: ISensus;
}): Promise<FirestoreResponse> {
  try {
    const docRef = await addDoc(collection(db, SENSUS_COLLECTION), {
      sensus: sensus.tanggalSensus,
      lokasi: sensus.lokasi,
      keterangan: sensus.keterangan,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      success: true,
      message: "Data sensus berhasil ditambahkan",
      data: { id: docRef.id },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Gagal menambahkan data sensus",
      errorCode: error.code,
    };
  }
}

export async function getAllSensus(): Promise<FirestoreResponse> {
  try {
    const querySnapshot = await getDocs(collection(db, SENSUS_COLLECTION));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      message: "Data sensus berhasil diambil",
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Gagal mengambil data sensus",
      errorCode: error.code,
    };
  }
}

export async function getSensusById(id: string): Promise<FirestoreResponse> {
  try {
    const docRef = doc(db, SENSUS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        message: "Data sensus tidak ditemukan",
      };
    }

    return {
      success: true,
      message: "Data sensus berhasil diambil",
      data: { id: docSnap.id, ...docSnap.data() },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Gagal mengambil data sensus",
      errorCode: error.code,
    };
  }
}

export async function updateSensus(
  id: string,
  dataUpdate: Partial<{
    tanggalSensus: string;
    lokasi: string;
    keterangan: string;
  }>
): Promise<FirestoreResponse> {
  try {
    const docRef = doc(db, SENSUS_COLLECTION, id);
    await updateDoc(docRef, {
      ...dataUpdate,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: "Data sensus berhasil diperbarui",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Gagal memperbarui data sensus",
      errorCode: error.code,
    };
  }
}

export async function deleteSensus(id: string): Promise<FirestoreResponse> {
  try {
    await deleteDoc(doc(db, SENSUS_COLLECTION, id));
    return {
      success: true,
      message: "Data sensus berhasil dihapus",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Gagal menghapus data sensus",
      errorCode: error.code,
    };
  }
}
