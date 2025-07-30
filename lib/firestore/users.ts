import { db } from "@/config/firebase-init";
import { FirestoreResponse, IDataPengguna } from "@/types/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { checkAuth } from "../auth";

export async function getAllUsers(): Promise<
  FirestoreResponse<IDataPengguna[] | null>
> {
  try {
    await checkAuth();

    const querySnapshot = await getDocs(collection(db, "users"));
    const data: IDataPengguna[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as IDataPengguna);
    });
    return {
      success: true,
      message: "Berhasil mengambil data pengguna",
      data,
    };
  } catch (error: any) {
    console.error("Gagal mengambil data pengguna:", error);
    return {
      success: false,
      message: error.message || "Gagal mengambil data pengguna",
      errorCode: error.code || "unknown",
    };
  }
}

export async function getUserById(userId: string) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export async function createUser({
  userId,
  nama,
  email,
  role = "user",
}: {
  userId: string;
  nama: string;
  email: string;
  role?: string;
}) {
  const docRef = await addDoc(collection(db, "users"), {
    userId,
    role,
    nama,
    email,
  });
  return docRef;
}

export async function updateUserRole(
  userId: string,
  role: string
): Promise<FirestoreResponse<void>> {
  try {
    if (!userId) {
      throw new Error("ID pengguna diperlukan");
    }
    if (!role) {
      throw new Error("Role diperlukan");
    }

    await checkAuth();

    const validRoles = ["admin", "petugas", "user"];
    if (!validRoles.includes(role)) {
      throw new Error("Role tidak valid");
    }

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role });

    return {
      success: true,
      message: "Role pengguna berhasil diperbarui",
    };
  } catch (error: any) {
    console.error("Gagal memperbarui role pengguna:", error);
    return {
      success: false,
      message: error.message || "Gagal memperbarui role pengguna",
      errorCode: error.code || "unknown",
    };
  }
}
