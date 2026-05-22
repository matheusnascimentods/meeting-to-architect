import { FileCodeIcon } from "@primer/octicons-react";
import { Button } from "@primer/react";
import "./styles.css";

const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
const mutedColor = "#6E6E73";

export function EmptyState() {
  return (
    <div className="empty-state">
      <FileCodeIcon size={64} fill={mutedColor} />
      <h2 className="empty-state-title">No diagrams yet</h2>
      <p className="empty-state-description">
        Upload a meeting transcript to generate your first architecture diagram.
      </p>
      <Button variant="primary">Upload Transcript</Button>
    </div>
  );
}
