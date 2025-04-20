import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Map } from "../models/Map";
import { MapDraftStore } from "../models/MapDraftStore.ts";

export const useMapDraftStore = create<MapDraftStore>()(
  persist(
    (set, get) => ({
      draftMap: null,
      setMap: (map: Map | null) => set({ draftMap: map }),
      addPlace: (placeId) => {
        const current = get().draftMap;
        if (!current) {
          set({
            draftMap: {
              _id: 0,
              name: "",
              description: "",
              places: [placeId],
              likes: [],
            },
          });
          return;
        }
        if (!current.places.includes(placeId)) {
          set({
            draftMap: {
              ...current,
              places: [...current.places, placeId],
            },
          });
        }
      },
      removePlace: (placeId) => {
        const current = get().draftMap;
        if (current) {
          set({
            draftMap: {
              ...current,
              places: current.places.filter((id) => id !== placeId),
            },
          });
        }
      },
      reset: () => set({ draftMap: null }),
    }),
    {
      name: "map-draft",
    },
  ),
);
