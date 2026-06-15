import { User } from "../../types";

export interface AuthContextType {
  user: User | null;
  onLogout: () => void;
}
