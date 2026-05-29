import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import "./styles.css";

let mermaidInitialized = false;

interface MermaidPreviewProps {
  source: string;
  id: string;
}

export function MermaidPreview({ source, id }: MermaidPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({ startOnLoad: false, theme: "neutral" });
      mermaidInitialized = true;
    }
    let cancelled = false;
    setError(false);
    const renderId = `m2a-mermaid-${id}-${Date.now()}`;
    mermaid
      .render(renderId, source)
      .then(({ svg }) => {
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [source, id]);

  if (error) {
    return (
      <div className="mermaid-error">
        Preview unavailable
      </div>
    );
  }
  return (
    <div
      ref={ref}
      className="m2a-mermaid mermaid-container"
    />
  );
}
