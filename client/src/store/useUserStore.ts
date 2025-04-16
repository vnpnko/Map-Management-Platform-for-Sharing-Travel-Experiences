import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../models/User";
import { UserStore } from "../models/UserStore";

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User | null) => {
        set({ user });
      },
    }),
    {
      name: "user",
    },
  ),
);
