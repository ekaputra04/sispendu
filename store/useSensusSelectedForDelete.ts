import { ISensus } from "@/types/types";
import { create } from "zustand";

interface SensusState {
  sensus: ISensus | null;
  isOpen: boolean;
  setSensus: (kk: ISensus) => void;
  clearSensus: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSensusSelectedForDelete = create<SensusState>()((set) => ({
  sensus: null,
  isOpen: false,
  setSensus: (kk: ISensus) => set({ sensus: kk }),
  clearSensus: () => set({ sensus: null }),
  setIsOpen: (isOpen: boolean) => set({ isOpen: isOpen }),
}));
