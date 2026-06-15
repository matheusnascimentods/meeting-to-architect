export interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: 'diagrams' | 'teams' | 'trash';
  onNavigate: (page: 'diagrams' | 'teams' | 'trash') => void;
  onLogout: () => void;
}
