import { db } from "@/config/firebase-init";
import { IKartuKeluarga } from "@/types/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export async function getAllKK(): Promise<IKartuKeluarga[]> {
  const querySnapshot = await getDocs(collection(db, "kartu-keluarga"));
  const data: IKartuKeluarga[] = [];
  querySnapshot.forEach((doc) => {
    data.push(doc.data() as IKartuKeluarga);
  });
  return data;
}

export async function getKKById(kkId: string): Promise<IKartuKeluarga | null> {
  const docRef = doc(db, "kartu-keluarga", kkId);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as IKartuKeluarga;
}

export async function createKK({ kk }: { kk: IKartuKeluarga }) {
  // const docRef = await addDoc(collection(db, "kartu-keluarga"), {
  //   ...kk,
  // });
  const docRef = await setDoc(doc(db, "kartu-keluarga", kk.id as string), {
    id: kk.id,
    ...kk,
  });
  return docRef;
}

export async function updateKK(kkId: string, kk: IKartuKeluarga) {
  const docRef = doc(db, "kartu-keluarga", kkId);
  const result = await updateDoc(docRef, { ...kk });
  return result;
}

export async function deleteKK(kkId: string) {
  const docRef = doc(db, "kartu-keluarga", kkId);
  const result = await deleteDoc(docRef);
  return result;
}
