import styles from "./index.module.css";

export function PanelHeader({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className={styles["panel-header"]}>
      {left}
      {right}
    </div>
  );
}
