import { db } from "@/config/firebase-init";
import { IKartuKeluarga } from "@/types/types";
import { addDoc, collection, getDocs } from "firebase/firestore";

export async function getAllKK() {
  const querySnapshot = await getDocs(collection(db, "kartu-keluarga"));
  const data: IKartuKeluarga[] = [];
  querySnapshot.forEach((doc) => {
    data.push(doc.data() as IKartuKeluarga);
  });
  return data;
}

export async function createKK({ kk }: { kk: IKartuKeluarga }) {
  const docRef = await addDoc(collection(db, "kartu-keluarga"), {
    ...kk,
  });
  return docRef;
}
