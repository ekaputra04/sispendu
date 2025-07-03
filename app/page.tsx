"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase-init";
import { addDoc, collection } from "firebase/firestore";

export default function Home() {
  const handleClick = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815,
      });
      console.log("Document written with ID: ", docRef.id);
      alert("Data Berhasil Terkirim");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Data Gagal Terkirim");
    }
  };
  return (
    <div className="">
      <Button onClick={handleClick}>Kirim</Button>
    </div>
  );
}
