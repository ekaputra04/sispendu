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

    console.log("Mengambil data dari koleksi penduduk...");
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

export async function getPendudukByNik(
  nik: string
): Promise<FirestoreResponse<IDataPenduduk | null>> {
  try {
    if (!nik) {
      throw new Error("NIK diperlukan");
    }

    await checkAuth();

    const q = query(collection(db, "penduduk"), where("nik", "==", nik));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: `Penduduk dengan NIK ${nik} tidak ditemukan`,
        data: null,
      };
    }

    const penduduk = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0];

    return {
      success: true,
      data: penduduk as IDataPenduduk,
      message: "Berhasil mengambil data penduduk",
    };
  } catch (error: any) {
    console.error("Gagal mencari penduduk berdasarkan NIK:", error);
    return {
      success: false,
      message: error.message || "Gagal mencari penduduk",
      errorCode: error.code || "unknown",
    };
  }
}

export async function getPendudukByName(
  nama: string
): Promise<FirestoreResponse<IDataPenduduk[] | null>> {
  try {
    if (!nama) {
      throw new Error("Nama diperlukan");
    }

    await checkAuth();

    console.log(`Mencari penduduk dengan nama: ${nama}`);

    const q = query(
      collection(db, "penduduk"),
      where("namaLowerCase", ">=", nama.toLowerCase()),
      where("namaLowerCase", "<=", nama.toLowerCase() + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    const pendudukList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      data: pendudukList as IDataPenduduk[],
      message: pendudukList.length
        ? "Berhasil menemukan penduduk"
        : "Tidak ada penduduk ditemukan",
    };
  } catch (error: any) {
    console.error("Gagal mencari penduduk:", error);
    return {
      success: false,
      message: error.message || "Gagal mencari penduduk",
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
      // !penduduk.nik ||
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

    // console.log(`Memeriksa keunikan NIK: ${penduduk.nik}`);
    // const nikQuery = query(
    //   collection(db, "penduduk"),
    //   where("nik", "==", penduduk.nik)
    // );
    // const nikSnapshot = await getDocs(nikQuery);
    // if (!nikSnapshot.empty) {
    //   throw new Error("NIK sudah terdaftar");
    // }

    const docRef = doc(db, "penduduk", penduduk.id);

    await setDoc(docRef, {
      ...penduduk,
      namaLowerCase: penduduk.nama.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
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

    // if (penduduk.nik && penduduk.nik !== docSnap.data().nik) {
    //   const nikQuery = query(
    //     collection(db, "penduduk"),
    //     where("nik", "==", penduduk.nik)
    //   );
    //   const nikSnapshot = await getDocs(nikQuery);
    //   if (!nikSnapshot.empty) {
    //     throw new Error("NIK sudah terdaftar");
    //   }
    // }

    await setDoc(
      docRef,
      {
        ...penduduk,
        namaLowerCase: penduduk.nama ? penduduk.nama.toLowerCase() : undefined,
        updatedAt: new Date(),
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
