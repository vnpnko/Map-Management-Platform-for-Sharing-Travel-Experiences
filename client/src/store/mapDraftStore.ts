import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Map } from "../models/Map";
import { MapDraftStore } from "../models/MapDraftStore.ts";

export const mapDraftStore = create<MapDraftStore>()(
  persist(
    (set, get) => ({
      mapDraft: null,
      setMapDraft: (map: Map | null) => set({ mapDraft: map }),
      addPlace: (placeId) => {
        const current = get().mapDraft;
        if (!current) {
          set({
            mapDraft: {
              _id: 0,
              name: "",
              description: "",
              places: [placeId],
              likes: [],
              creatorUsername: "",
            },
          });
          return;
        }
        if (!current.places.includes(placeId)) {
          set({
            mapDraft: {
              ...current,
              places: [...current.places, placeId],
            },
          });
        }
      },
      removePlace: (placeId) => {
        const current = get().mapDraft;
        if (current) {
          set({
            mapDraft: {
              ...current,
              places: current.places.filter((id) => id !== placeId),
            },
          });
        }
      },
    }),
    {
      name: "map-draft",
    },
  ),
);
