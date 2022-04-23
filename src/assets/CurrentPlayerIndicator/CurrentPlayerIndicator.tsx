import Player from "../../players/player";
import styles from "./CurrentPlayerIndicator.module.css";
import { rgbToCssString } from "../../utils/RGB";

interface Props {
  currentPlayer: Player;
  humanPlayer?: Player | null;
}

const CurrentPlayerIndicator: React.FC<Props> = ({
  currentPlayer,
  humanPlayer,
}) => {
  const currentPlayerEmpire = currentPlayer.empire;
  const empireColor = currentPlayerEmpire.color;
  const currentPlayerEmpireName =
    currentPlayer === humanPlayer ? "You" : currentPlayerEmpire.name;
  return (
    <div className={styles.footer}>
      <div className={styles["current-player-container"]}>
        <div
          className={styles["current-player-indicator"]}
          style={{ backgroundColor: rgbToCssString(empireColor) }}
        />
        <div className={styles["current-player-text"]}>
          {currentPlayerEmpireName}
        </div>
      </div>
    </div>
  );
};

export default CurrentPlayerIndicator;
