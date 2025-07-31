import { db } from "@/config/firebase-init";
import { FirestoreResponse, IDataPenduduk } from "@/types/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { checkAuth } from "../auth";

export async function getAllPenduduk(): Promise<
  FirestoreResponse<IDataPenduduk[] | null>
> {
  try {
    await checkAuth();

    const querySnapshot = await getDocs(collection(db, "penduduk"));
    const data: IDataPenduduk[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as IDataPenduduk);
    });
    return {
      success: true,
      message: "Berhasil mengambil data kartu keluarga",
      data,
    };
  } catch (error: any) {
    console.error("Gagal mengambil data penduduk:", error);
    return {
      success: false,
      message: error.message || "Gagal mengambil data penduduk",
      errorCode: error.code || "unknown",
    };
  }
}

export async function getPendudukById(
  id: string
): Promise<FirestoreResponse<IDataPenduduk | null>> {
  try {
    if (!id) {
      throw new Error("ID diperlukan");
    }

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id
      )
    ) {
      throw new Error("ID tidak valid");
    }

    await checkAuth();
    const docRef = doc(db, "penduduk", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        message: `Penduduk dengan ID ${id} tidak ditemukan`,
        data: null,
      };
    }

    return {
      success: true,
      message: "Berhasil mengambil data penduduk",
      data: { id: docSnap.id, ...docSnap.data() } as IDataPenduduk,
    };
  } catch (error: any) {
    console.error("Gagal mengambil data penduduk:", error);
    return {
      success: false,
      message: error.message || "Gagal mengambil data penduduk",
      errorCode: error.code || "unknown",
    };
  }
}

export async function getPendudukByName(
  nama: string
): Promise<FirestoreResponse<IDataPenduduk[] | null>> {
  try {
    if (!nama || nama.trim().length < 2) {
      throw new Error("Nama pencarian harus diisi minimal 2 karakter");
    }

    await checkAuth();

    // Ubah input ke huruf kecil dan pecah menjadi kata-kata
    const searchTerms = nama
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length >= 2);

    // Buat query untuk setiap kata pencarian menggunakan array-contains
    const queries = searchTerms.map((term) =>
      query(
        collection(db, "penduduk"),
        where("namaKeywords", "array-contains", term)
      )
    );

    // Jalankan semua query dan gabungkan hasilnya
    const results: IDataPenduduk[] = [];
    const uniqueIds = new Set<string>();

    for (const q of queries) {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (!uniqueIds.has(doc.id)) {
          uniqueIds.add(doc.id);
          results.push({
            id: doc.id,
            ...doc.data(),
          } as IDataPenduduk);
        }
      });
    }

    console.log(
      `Ditemukan ${results.length} penduduk untuk pencarian: ${nama}`
    );

    return {
      success: true,
      data: results,
      message: results.length
        ? "Berhasil menemukan penduduk"
        : "Tidak ada penduduk ditemukan",
    };
  } catch (error: any) {
    console.error("Gagal mencari penduduk:", error);
    return {
      success: false,
      message: error.message || "Gagal mencari penduduk. Silakan coba lagi.",
      errorCode: error.code || "unknown",
    };
  }
}

export async function getPendudukByCreatedBy(
  email: string
): Promise<FirestoreResponse<IDataPenduduk[]>> {
  try {
    const q = query(
      collection(db, "penduduk"),
      where("createdBy", "==", email)
    );
    const querySnapshot = await getDocs(q);
    const data: IDataPenduduk[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as IDataPenduduk);
    });
    return {
      success: true,
      message: "Berhasil mengambil data penduduk berdasarkan pembuat",
      data,
    };
  } catch (error: any) {
    console.error("Gagal mengambil data penduduk:", error);
    return {
      success: false,
      message: error.message || "Gagal mengambil data penduduk",
      errorCode: error.code || "unknown",
    };
  }
}

export async function createPenduduk({
  penduduk,
}: {
  penduduk: IDataPenduduk;
}) {
  try {
    await checkAuth();

    if (
      !penduduk.id ||
      !penduduk.nama ||
      !penduduk.jenisKelamin ||
      !penduduk.tempatLahir ||
      !penduduk.tanggalLahir ||
      !penduduk.agama ||
      !penduduk.pendidikan ||
      !penduduk.jenisPekerjaan ||
      !penduduk.statusPerkawinan ||
      !penduduk.kewarganegaraan
    ) {
      throw new Error("Semua field wajib diisi");
    }

    const namaLowerCase = penduduk.nama.toLowerCase();
    const namaKeywords = namaLowerCase
      .split(" ")
      .filter((word) => word.length > 2);
    const pendudukData = {
      ...penduduk,
      namaLowerCase,
      namaKeywords,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = doc(db, "penduduk", penduduk.id);

    await setDoc(docRef, {
      ...pendudukData,
    });

    return {
      success: true,
      data: { penduduk },
      message: "Penduduk berhasil ditambahkan",
    };
  } catch (error: any) {
    console.error("Gagal membuat penduduk:", error);
    return {
      success: false,
      message: error.message || "Gagal membuat penduduk",
      errorCode: error.code || "unknown",
    };
  }
}

export async function updatePenduduk({
  id,
  penduduk,
}: {
  id: string;
  penduduk: Partial<IDataPenduduk>;
}) {
  try {
    await checkAuth();

    if (!id) {
      throw new Error("ID diperlukan");
    }

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id
      )
    ) {
      throw new Error("ID tidak valid");
    }

    const docRef = doc(db, "penduduk", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("Penduduk tidak ditemukan");
    }

    const namaLowerCase = penduduk?.nama?.toLowerCase();
    const namaKeywords = namaLowerCase
      ? namaLowerCase.split(" ").filter((word) => word.length > 2)
      : [];
    const pendudukData = {
      ...penduduk,
      namaLowerCase,
      namaKeywords,
      updatedAt: new Date(),
    };

    await setDoc(
      docRef,
      {
        ...pendudukData,
      },
      { merge: true }
    );

    return {
      success: true,
      data: { id },
      message: "Penduduk berhasil diperbarui",
    };
  } catch (error: any) {
    console.error("Gagal memperbarui penduduk:", error);
    return {
      success: false,
      message: error.message || "Gagal memperbarui penduduk",
      errorCode: error.code || "unknown",
    };
  }
}

export async function deletePenduduk(id: string) {
  try {
    await checkAuth();

    if (!id) {
      throw new Error("ID diperlukan");
    }

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id
      )
    ) {
      throw new Error("ID tidak valid");
    }

    const docRef = doc(db, "penduduk", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("Penduduk tidak ditemukan");
    }

    await deleteDoc(docRef);

    return {
      success: true,
      data: { id },
      message: "Penduduk berhasil dihapus",
    };
  } catch (error: any) {
    console.error("Gagal menghapus penduduk:", error);
    return {
      success: false,
      message: error.message || "Gagal menghapus penduduk",
      errorCode: error.code || "unknown",
    };
  }
}
