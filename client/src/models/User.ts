export interface User {
  _id: number;
  username: string;
  name: string;
  followers: number[];
  following: number[];
  places: string[];
}
