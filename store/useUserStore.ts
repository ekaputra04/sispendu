import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  user: {
    userId: string;
    nama: string;
    email: string;
  };
  setUser: ({
    userId,
    nama,
    email,
  }: {
    userId: string;
    nama: string;
    email: string;
  }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: { userId: "", nama: "", email: "" },
      setUser: ({
        userId,
        nama,
        email,
      }: {
        userId: string;
        nama: string;
        email: string;
      }) => set({ user: { userId, nama, email } }),
      clearUser: () => set({ user: { userId: "", nama: "", email: "" } }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
