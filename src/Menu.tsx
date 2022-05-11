import React from "react";
import { Button } from "react-bootstrap";
import styles from "./Menu.module.css";

type Props = {
  onNewHotseatGame: () => void;
  onNewVsAiGame: () => void;
  onAIOnlyGame: () => void;
  onCredits: () => void;
};

type MenuButtonProps = { text: string; onClick: () => void };

const MenuButton: React.FC<MenuButtonProps> = ({ text, onClick }) => {
  return (
    <Button onClick={onClick} style={{ fontSize: "3rem", width: "20rem" }}>
      {text}
    </Button>
  );
};

const Menu: React.FC<Props> = ({
  onNewHotseatGame,
  onNewVsAiGame,
  onAIOnlyGame,
  onCredits,
}) => {
  return (
    <div className={styles["menu-container"]}>
      <h1>Realms</h1>
      <div className={styles["buttons-container"]}>
        <MenuButton text="New Hot Seat Game" onClick={onNewHotseatGame} />
        <MenuButton text="New vs AI Game" onClick={onNewVsAiGame} />
        <MenuButton text="AI Only Game" onClick={onAIOnlyGame} />
        <MenuButton text="Credits" onClick={onCredits} />
      </div>
    </div>
  );
};

export default Menu;
