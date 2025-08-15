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
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { checkAuth } from "../auth";

const SENSUS_COLLECTION = "sensus";

export async function createSensus({
  sensus,
}: {
  sensus: ISensus;
}): Promise<FirestoreResponse> {
  try {
    await checkAuth();

    const sensusData = {
      ...sensus,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(doc(db, SENSUS_COLLECTION, sensus.id), sensusData);

    return {
      success: true,
      message: "Data sensus berhasil ditambahkan",
      data: sensusData,
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
    const q = query(
      collection(db, SENSUS_COLLECTION),
      orderBy("updatedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
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
  sensusId: string,
  sensus: ISensus
): Promise<FirestoreResponse<void>> {
  try {
    if (!sensusId) {
      throw new Error("ID sensus diperlukan");
    }
    await checkAuth();
    const docRef = doc(db, "sensus", sensusId);
    await updateDoc(docRef, { ...sensus, updatedAt: Timestamp.now() });
    return {
      success: true,
      message: "Sensus berhasil diperbarui",
    };
  } catch (error: any) {
    console.error("Gagal memperbarui sensus:", error);
    return {
      success: false,
      message: error.message || "Gagal memperbarui sensus",
      errorCode: error.code || "unknown",
    };
  }
}

// export async function updateSensus(
//   id: string,
//   sensus: ISensus
// ): Promise<FirestoreResponse<void>> {
//   try {
//     if (!id) {
//       throw new Error("ID sensus diperlukan");
//     }
//     await checkAuth();

//     const docRef = doc(db, SENSUS_COLLECTION, id);
//     await updateDoc(docRef, {
//       ...sensus,
//       updatedAt: Timestamp.now(),
//     });

//     return {
//       success: true,
//       message: "Data sensus berhasil diperbarui",
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: "Gagal memperbarui data sensus",
//       errorCode: error.code,
//     };
//   }
// }

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
