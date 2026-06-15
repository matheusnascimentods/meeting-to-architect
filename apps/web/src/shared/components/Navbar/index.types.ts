import { User } from "@/features/auth/types";

export interface NavbarProps {
  showBack?: boolean;
  onBack?: () => void;
  showNewButton?: boolean;
  onNewClick?: () => void;
  user?: User | null;
  onLogout?: () => void;
}
