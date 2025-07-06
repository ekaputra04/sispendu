import { IDataPenduduk } from "@/types/types";
import { create } from "zustand";

interface PendudukState {
  penduduk: IDataPenduduk | null;
  isOpen: boolean;
  setPenduduk: (kk: IDataPenduduk) => void;
  clearPenduduk: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const usePendudukSelectedForDelete = create<PendudukState>()((set) => ({
  penduduk: null,
  isOpen: false,
  setPenduduk: (kk: IDataPenduduk) => set({ penduduk: kk }),
  clearPenduduk: () => set({ penduduk: null }),
  setIsOpen: (isOpen: boolean) => set({ isOpen: isOpen }),
}));
