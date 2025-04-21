import { Location } from "./Location.ts";

export interface Place {
  _id: string;
  name: string;
  url: string;
  likes: number[];
  location: Location;
  formattedAddress?: string;
  types?: string[];
  photoUrl: string;
}
