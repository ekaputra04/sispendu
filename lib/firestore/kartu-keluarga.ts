import { db } from "@/config/firebase-init";
import {
  FirestoreResponse,
  IAnggotaKeluarga,
  IDataPenduduk,
  IKartuKeluarga,
  TStatusHubunganDalamKeluarga,
} from "@/types/types";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { checkAuth } from "../auth";
import { StatusHubunganDalamKeluarga } from "@/consts/dataDefinitions";

export async function getAllKK(): Promise<FirestoreResponse<IKartuKeluarga[]>> {
  try {
    await checkAuth();
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

    await checkAuth();
    const docRef = doc(db, "kartu-keluarga", kkId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return {
        success: false,
        message: `Kartu keluarga dengan ID ${kkId} tidak ditemukan`,
        data: null,
      };
    }

    const anggotaSnapshot = await getDocs(
      collection(db, "kartu-keluarga", kkId, "anggota")
    );

    const anggota: IAnggotaKeluarga[] = [];

    for (const anggotaDoc of anggotaSnapshot.docs) {
      const anggotaData = anggotaDoc.data();
      console.log(anggotaData);

      const pendudukDocRef = doc(db, "penduduk", anggotaData.pendudukId);
      const pendudukDocSnap = await getDoc(pendudukDocRef);

      if (pendudukDocSnap.exists()) {
        anggota.push({
          pendudukId: anggotaData.pendudukId,
          statusHubunganDalamKeluarga: anggotaData.statusHubunganDalamKeluarga,
          detail: pendudukDocSnap.data() as IDataPenduduk,
        });
      }
    }

    return {
      success: true,
      message: "Berhasil mengambil data kartu keluarga",
      data: {
        id: docSnap.id,
        ...docSnap.data(),
        anggota,
      } as IKartuKeluarga,
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

export async function getKKByCreatedBy(
  createdBy: string
): Promise<FirestoreResponse<IKartuKeluarga[]>> {
  try {
    await checkAuth();
    const q = query(
      collection(db, "kartu-keluarga"),
      where("createdBy", "==", createdBy)
    );
    const querySnapshot = await getDocs(q);
    const data: IKartuKeluarga[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as IKartuKeluarga);
    });
    return {
      success: true,
      message: "Berhasil mengambil data kartu keluarga berdasarkan pembuat",
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

export async function createKK({
  kk,
}: {
  kk: IKartuKeluarga;
}): Promise<FirestoreResponse<void>> {
  try {
    if (!kk.id) {
      throw new Error("ID kartu keluarga diperlukan");
    }
    await checkAuth();
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

export async function updateKK(
  kkId: string,
  kk: IKartuKeluarga
): Promise<FirestoreResponse<void>> {
  try {
    if (!kkId) {
      throw new Error("ID kartu keluarga diperlukan");
    }
    await checkAuth();
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

export async function deleteKK(kkId: string): Promise<FirestoreResponse<void>> {
  try {
    if (!kkId) {
      throw new Error("ID kartu keluarga diperlukan");
    }
    await checkAuth();
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

export async function addAnggotaToKK({
  kkId,
  pendudukId,
  statusHubunganDalamKeluarga,
}: {
  kkId: string;
  pendudukId: string;
  statusHubunganDalamKeluarga: TStatusHubunganDalamKeluarga;
}): Promise<FirestoreResponse<void>> {
  try {
    if (!kkId) {
      throw new Error("ID kartu keluarga diperlukan");
    }
    if (!pendudukId) {
      throw new Error("ID penduduk diperlukan");
    }
    if (!statusHubunganDalamKeluarga) {
      throw new Error("Status hubungan dalam keluarga diperlukan");
    }

    await checkAuth();

    const kkDocRef = doc(db, "kartu-keluarga", kkId);
    const kkDocSnap = await getDoc(kkDocRef);
    if (!kkDocSnap.exists()) {
      throw new Error(`Kartu keluarga dengan ID ${kkId} tidak ditemukan`);
    }

    const pendudukDocRef = doc(db, "penduduk", pendudukId);
    const pendudukDocSnap = await getDoc(pendudukDocRef);
    if (!pendudukDocSnap.exists()) {
      throw new Error(`Penduduk dengan ID ${pendudukId} tidak ditemukan`);
    }

    const validStatuses: TStatusHubunganDalamKeluarga[] =
      StatusHubunganDalamKeluarga;
    if (!validStatuses.includes(statusHubunganDalamKeluarga)) {
      throw new Error("Status hubungan dalam keluarga tidak valid");
    }

    const anggotaDocRef = doc(
      db,
      "kartu-keluarga",
      kkId,
      "anggota",
      pendudukId
    );
    await setDoc(anggotaDocRef, {
      pendudukId,
      statusHubunganDalamKeluarga,
    });

    await updateDoc(pendudukDocRef, {
      kkRef: kkId,
    });

    return {
      success: true,
      message:
        "Anggota berhasil ditambahkan ke kartu keluarga dan penduduk telah diupdate",
    };
  } catch (error: any) {
    console.error("Gagal menambahkan anggota ke kartu keluarga:", error);
    return {
      success: false,
      message: error.message || "Gagal menambahkan anggota ke kartu keluarga",
      errorCode: error.code || "unknown",
    };
  }
}

export async function deleteAnggotaFromKK({
  kkId,
  pendudukId,
}: {
  kkId: string;
  pendudukId: string;
}): Promise<FirestoreResponse<void>> {
  try {
    if (!kkId) {
      throw new Error("ID kartu keluarga diperlukan");
    }
    if (!pendudukId) {
      throw new Error("ID penduduk diperlukan");
    }

    await checkAuth();

    const kkDocRef = doc(db, "kartu-keluarga", kkId);
    const kkDocSnap = await getDoc(kkDocRef);
    if (!kkDocSnap.exists()) {
      throw new Error(`Kartu keluarga dengan ID ${kkId} tidak ditemukan`);
    }

    const pendudukDocRef = doc(db, "penduduk", pendudukId);
    const pendudukDocSnap = await getDoc(pendudukDocRef);
    if (!pendudukDocSnap.exists()) {
      throw new Error(`Penduduk dengan ID ${pendudukId} tidak ditemukan`);
    }

    const anggotaDocRef = doc(
      db,
      "kartu-keluarga",
      kkId,
      "anggota",
      pendudukId
    );
    const anggotaDocSnap = await getDoc(anggotaDocRef);
    if (!anggotaDocSnap.exists()) {
      throw new Error(
        `Anggota dengan ID ${pendudukId} tidak ditemukan di kartu keluarga ${kkId}`
      );
    }

    await deleteDoc(anggotaDocRef);

    await updateDoc(pendudukDocRef, {
      kkRef: deleteField(),
    });

    return {
      success: true,
      message:
        "Anggota berhasil dihapus dari kartu keluarga dan kkRef telah dihapus dari penduduk",
    };
  } catch (error: any) {
    console.error("Gagal menghapus anggota dari kartu keluarga:", error);
    return {
      success: false,
      message: error.message || "Gagal menghapus anggota dari kartu keluarga",
      errorCode: error.code || "unknown",
    };
  }
}
