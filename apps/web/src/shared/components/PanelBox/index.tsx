import styles from "./index.module.css";
import { PanelBoxProps } from "./index.types";

export function PanelBox({ children }: PanelBoxProps) {
  return (
    <div className={styles["panel-box"]}>
      {children}
    </div>
  );
}
