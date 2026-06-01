import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PeopleIcon, BellIcon, TrashIcon } from "@primer/octicons-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AppLayout } from "@/shared/components/AppLayout";
import { DiagramsScreen } from "@/features/diagrams/components/DiagramsScreen";
import { ComingSoon } from "@/shared/components/ComingSoon";
import { TrashScreen } from "@/features/diagrams/components/TrashScreen";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

type SidebarPage = 'diagrams' | 'teams' | 'notifications' | 'trash';

function Dashboard() {
  const [currentPage, setCurrentPage] = useState<SidebarPage>('diagrams');
  const { onLogout } = useAuth();

  return (
    <AppLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={onLogout}
    >
      {currentPage === 'diagrams' && <DiagramsScreen />}
      {currentPage === 'teams' && <ComingSoon icon={PeopleIcon} label="My Teams" />}
      {currentPage === 'notifications' && <ComingSoon icon={BellIcon} label="Notifications" />}
      {currentPage === 'trash' && <TrashScreen onNavigate={setCurrentPage} />}
    </AppLayout>
  );
}
