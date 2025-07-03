import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Definisikan tipe untuk state
interface UserState {
  nama: string;
  email: string;
  setUser: ({ nama, email }: { nama: string; email: string }) => void;
  clearUser: () => void;
}

// Buat store dengan middleware persist
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      nama: "",
      email: "",
      setUser: ({ nama, email }: { nama: string; email: string }) =>
        set({ nama, email }),
      clearUser: () => set({ nama: "", email: "" }),
    }),
    {
      name: "user-storage", // Nama kunci untuk penyimpanan di localStorage
      storage: createJSONStorage(() => localStorage), // Gunakan localStorage (bisa diganti sessionStorage)
    }
  )
);
