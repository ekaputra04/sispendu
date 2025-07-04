import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SessionState {
  session: string;
  setSession: (session: string) => void;
  clearUser: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: "",
      setSession: (session: string) => set({ session }),
      clearUser: () => set({ session: "" }),
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
