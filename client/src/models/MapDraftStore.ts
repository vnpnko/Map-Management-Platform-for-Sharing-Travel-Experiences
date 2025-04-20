import { Map } from "./Map";

export interface MapDraftStore {
  mapDraft: Map | null;
  setMapDraft: (map: Map | null) => void;
  addPlace: (placeId: string) => void;
  removePlace: (placeId: string) => void;
}
