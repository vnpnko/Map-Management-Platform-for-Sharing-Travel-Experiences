import { User } from "./User";

export interface UserStore {
  user: User | null;
  setUser: (user: User) => Promise<void>;
  // followUser: (userId: string) => Promise<void>;
  // unfollowUser: (userId: string) => Promise<void>;
  // addMapToUser: (mapId: string) => Promise<void>;
  // removeMapFromUser: (mapId: string) => Promise<void>;
  // addPlaceToUser: (placeId: string) => Promise<void>;
  // removePlaceFromUser: (placeId: string) => Promise<void>;
  // editUser: (userId: string, userData: Partial<User>) => Promise<void>;
  logout: () => void;
}
