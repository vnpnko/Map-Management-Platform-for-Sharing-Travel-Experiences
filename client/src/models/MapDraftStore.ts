import { Map } from "./Map";

export interface MapDraftStore {
  draftMap: Map | null;
  setMap: (map: Map | null) => void;
  addPlace: (placeId: string) => void;
  removePlace: (placeId: string) => void;
}
