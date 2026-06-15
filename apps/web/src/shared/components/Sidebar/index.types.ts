export type SidebarPage = 'diagrams' | 'teams' | 'trash';

export interface SidebarProps {
  currentPage: SidebarPage;
  onNavigate: (page: SidebarPage) => void;
  onLogout: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}
