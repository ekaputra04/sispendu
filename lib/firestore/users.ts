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

    console.log("Mengambil data dari koleksi pengguna...");
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

export async function updateUserRole(userId: string, role: string) {
  const userRef = doc(db, "users", userId);
  const result = await updateDoc(userRef, { role: role });
  return result;
}
