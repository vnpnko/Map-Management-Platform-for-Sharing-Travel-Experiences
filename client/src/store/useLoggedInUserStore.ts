import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../models/User";
import { LoggedInUserStore } from "../models/LoggedInUserStore.ts";

export const useLoggedInUserStore = create<LoggedInUserStore>()(
  persist(
    (set) => ({
      loggedInUser: null,
      setLoggedInUser: (loggedInUser: User | null) => {
        set({ loggedInUser });
      },
    }),
    {
      name: "loggedInUser",
    },
  ),
);
