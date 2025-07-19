import { IDataPengguna } from "@/types/types";
import { create } from "zustand";

interface PenggunaState {
  pengguna: IDataPengguna | null;
  isOpen: boolean;
  setPengguna: (kk: IDataPengguna) => void;
  clearPengguna: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const usePenggunaSelectedForUpdate = create<PenggunaState>()((set) => ({
  pengguna: null,
  isOpen: false,
  setPengguna: (kk: IDataPengguna) => set({ pengguna: kk }),
  clearPengguna: () => set({ pengguna: null }),
  setIsOpen: (isOpen: boolean) => set({ isOpen: isOpen }),
}));
