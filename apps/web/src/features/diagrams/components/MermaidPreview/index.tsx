import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import styles from "./index.module.css";

let mermaidInitialized = false;

interface MermaidPreviewProps {
  source: string;
  id: string;
}

function initMermaid() {
  if (mermaidInitialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
    securityLevel: "loose",
  });
  mermaidInitialized = true;
}

export function MermaidPreview({ source, id }: MermaidPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const code = source?.trim();
    if (!code) {
      setError(true);
      return;
    }

    initMermaid();
    let cancelled = false;
    setError(false);
    const renderId = `m2a-mermaid-${id}-${Date.now()}`;

    mermaid
      .render(renderId, code)
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
      <div className={styles['mermaid-error']}>
        Preview unavailable
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`m2a-mermaid ${styles['mermaid-container']}`}
    />
  );
}
