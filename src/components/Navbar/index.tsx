import { Button, IconButton } from "@primer/react";
import { ArrowLeftIcon, PlusIcon } from "@primer/octicons-react";
import "./styles.css";

interface NavbarProps {
  showBack?: boolean;
  onBack?: () => void;
  showNewButton?: boolean;
  onNewClick?: () => void;
}

export function Navbar({ showBack, onBack, showNewButton, onNewClick }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {showBack && (
          <IconButton
            icon={ArrowLeftIcon}
            aria-label="Back to list"
            variant="invisible"
            onClick={onBack}
          />
        )}
        <div className="navbar-brand">
          <span className="brand-name">M2A</span>
          <span className="brand-sub">Meeting to Architecture</span>
        </div>
      </div>
      {showNewButton && (
        <Button variant="primary" leadingVisual={PlusIcon} onClick={onNewClick}>New Diagram</Button>
      )}
    </nav>
  );
}
