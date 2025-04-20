export interface User {
  _id: number;
  name: string;
  username: string;
  password: string;
  followers: number[];
  following: number[];
  places: string[];
  maps: number[];
}
