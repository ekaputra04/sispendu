import { db } from "@/config/firebase-init";
import { IKartuKeluarga } from "@/types/types";
import { addDoc, collection } from "firebase/firestore";

interface CreateKKProps {
  kk: IKartuKeluarga;
}

export async function createKK({ kk }: CreateKKProps) {
  const docRef = await addDoc(collection(db, "kartu-keluarga"), {
    ...kk,
  });
  return docRef;
}
