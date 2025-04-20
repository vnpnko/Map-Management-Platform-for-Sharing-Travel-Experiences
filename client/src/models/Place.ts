export interface Place {
  _id: string;
  name: string;
  url: string;
  likes: number[];
  location: {
    lat: number;
    lng: number;
  };
  formattedAddress?: string;
  types?: string[];
  photoUrl: string;
}
