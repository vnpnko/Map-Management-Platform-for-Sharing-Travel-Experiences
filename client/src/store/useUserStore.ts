import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../models/User";
import { UserStore } from "../models/UserStore";

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: async (user: User) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        set({ user });
      },
      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: "user",
    },
  ),
);
