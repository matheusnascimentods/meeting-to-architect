import styles from "./index.module.css";

export function PanelBox({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles["panel-box"]}>
      {children}
    </div>
  );
}
