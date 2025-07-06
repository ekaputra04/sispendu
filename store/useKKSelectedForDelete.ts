import { IKartuKeluarga } from "@/types/types";
import { create } from "zustand";

interface KKState {
  kartuKeluarga: IKartuKeluarga | null;
  isOpen: boolean;
  setKartuKeluarga: (kk: IKartuKeluarga) => void;
  clearKartuKeluarga: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useKKSelectedForDelete = create<KKState>()((set) => ({
  kartuKeluarga: null,
  isOpen: false,
  setKartuKeluarga: (kk: IKartuKeluarga) => set({ kartuKeluarga: kk }),
  clearKartuKeluarga: () => set({ kartuKeluarga: null }),
  setIsOpen: (isOpen: boolean) => set({ isOpen: isOpen }),
}));
