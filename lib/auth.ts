import { db } from "@/config/firebase-init";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export async function checkAuth() {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        unsubscribe(); // Hentikan listener setelah status didapat
        if (!user) {
          reject(new Error("Pengguna tidak terautentikasi"));
          return;
        }
        // Verifikasi role pengguna
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (
            !userDoc.exists() ||
            !["admin", "petugas"].includes(userDoc.data().role)
          ) {
            reject(new Error("Akses tidak diizinkan"));
            return;
          }
          resolve(user);
        } catch (error: any) {
          reject(new Error("Gagal memeriksa role pengguna: " + error.message));
        }
      },
      (error) => {
        unsubscribe();
        reject(new Error("Gagal memeriksa autentikasi: " + error.message));
      }
    );
  });
}
