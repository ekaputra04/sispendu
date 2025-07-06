import { IKartuKeluarga } from "@/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface KKState {
  kartuKeluarga: IKartuKeluarga;
  isOpen: boolean;
  setKartuKeluarga: (kk: IKartuKeluarga) => void;
  clearKartuKeluarga: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

const initialKK: IKartuKeluarga = {
  id: "",
  noKK: "",
  namaKepalaKeluarga: "",
  alamat: "",
  rt: "",
  rw: "",
  desa: "",
  kecamatan: "",
  kabupaten: "",
  provinsi: "",
  kodePos: "",
  tanggalPenerbitan: "",
};

export const useKKSelectedForDelete = create<KKState>()(
  persist(
    (set) => ({
      kartuKeluarga: initialKK,
      isOpen: false,
      setKartuKeluarga: (kk: IKartuKeluarga) => set({ kartuKeluarga: kk }),
      clearKartuKeluarga: () => set({ kartuKeluarga: initialKK }),
      setIsOpen: (isOpen: boolean) => set({ isOpen: isOpen }),
    }),
    {
      name: "kk-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        kartuKeluarga: state.kartuKeluarga, // Hanya simpan kartuKeluarga, kecualikan isOpen
      }),
    }
  )
);
