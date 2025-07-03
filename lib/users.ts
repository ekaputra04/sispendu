import { db } from "@/config/firebase-init";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

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
