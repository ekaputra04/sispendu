import {
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase-init";
import { checkAuth } from "@/lib/auth";
import { FirestoreResponse, IContact } from "@/types/types";

// Create: Menambahkan dokumen kontak baru
export async function createContact(
  data: Omit<IContact, "id" | "createdAt" | "updatedAt">
): Promise<FirestoreResponse<IContact>> {
  try {
    const contactData = {
      ...data,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "contact"), contactData);
    const newContact: IContact = {
      id: docRef.id,
      ...contactData,
    };

    console.log(`Dokumen kontak ${docRef.id} berhasil dibuat`);

    return {
      success: true,
      message: "Pesan berhasil dikirim dan tersimpan",
      data: newContact,
    };
  } catch (error: any) {
    console.error("Gagal membuat dokumen kontak:", error);
    return {
      success: false,
      message: "Gagal mengirim pesan. Silakan coba lagi.",
      errorCode: error.code || "unknown",
    };
  }
}

// Read: Mengambil semua dokumen kontak
export async function getAllContacts(): Promise<FirestoreResponse<IContact[]>> {
  try {
    await checkAuth();

    const querySnapshot = await getDocs(collection(db, "contact"));
    const contacts: IContact[] = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as IContact)
    );

    console.log(`Mengambil ${contacts.length} dokumen kontak`);

    return {
      success: true,
      message: "Berhasil mengambil daftar pesan kontak",
      data: contacts,
    };
  } catch (error: any) {
    console.error("Gagal mengambil dokumen kontak:", error);
    return {
      success: false,
      message: "Gagal mengambil daftar pesan. Silakan coba lagi.",
      errorCode: error.code || "unknown",
    };
  }
}

// Read: Mengambil dokumen kontak berdasarkan ID
export async function getContactById(
  id: string
): Promise<FirestoreResponse<IContact>> {
  try {
    await checkAuth();

    const docRef = doc(db, "contact", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        message: "Pesan tidak ditemukan",
        errorCode: "not-found",
      };
    }

    const contact: IContact = {
      id: docSnap.id,
      ...docSnap.data(),
    } as IContact;

    console.log(`Dokumen kontak ${id} berhasil diambil`);

    return {
      success: true,
      message: "Berhasil mengambil pesan kontak",
      data: contact,
    };
  } catch (error: any) {
    console.error("Gagal mengambil dokumen kontak:", error);
    return {
      success: false,
      message: "Gagal mengambil pesan. Silakan coba lagi.",
      errorCode: error.code || "unknown",
    };
  }
}

// Update: Memperbarui dokumen kontak berdasarkan ID
export async function updateContact(
  id: string,
  data: Partial<Omit<IContact, "id" | "createdAt">>
): Promise<FirestoreResponse<IContact>> {
  try {
    await checkAuth();

    const docRef = doc(db, "contact", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        message: "Pesan tidak ditemukan",
        errorCode: "not-found",
      };
    }

    const updatedData = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updatedData);
    const updatedContact: IContact = {
      id,
      ...docSnap.data(),
      ...updatedData,
    } as IContact;

    console.log(`Dokumen kontak ${id} berhasil diperbarui`);

    return {
      success: true,
      message: "Pesan berhasil diperbarui",
      data: updatedContact,
    };
  } catch (error: any) {
    console.error("Gagal memperbarui dokumen kontak:", error);
    return {
      success: false,
      message: "Gagal memperbarui pesan. Silakan coba lagi.",
      errorCode: error.code || "unknown",
    };
  }
}

// Delete: Menghapus dokumen kontak berdasarkan ID
export async function deleteContact(
  id: string
): Promise<FirestoreResponse<null>> {
  try {
    await checkAuth();

    const docRef = doc(db, "contact", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        message: "Pesan tidak ditemukan",
        errorCode: "not-found",
      };
    }

    await deleteDoc(docRef);

    console.log(`Dokumen kontak ${id} berhasil dihapus`);

    return {
      success: true,
      message: "Pesan berhasil dihapus",
      data: null,
    };
  } catch (error: any) {
    console.error("Gagal menghapus dokumen kontak:", error);
    return {
      success: false,
      message: "Gagal menghapus pesan. Silakan coba lagi.",
      errorCode: error.code || "unknown",
    };
  }
}
