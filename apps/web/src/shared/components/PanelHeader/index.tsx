import styles from "./index.module.css";
import { PanelHeaderProps } from "./index.types";

export function PanelHeader({ left, right }: PanelHeaderProps) {
  return (
    <div className={styles["panel-header"]}>
      {left}
      {right}
    </div>
  );
}
