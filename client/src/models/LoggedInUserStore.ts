import { User } from "./User";

export interface LoggedInUserStore {
  loggedInUser: User | null;
  setLoggedInUser: (user: User | null) => void;
}
