import React from "react";
import { Button } from "react-bootstrap";
import styles from "./Menu.module.css";

type Props = {
  onNewGame: () => void;
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

const Menu: React.FC<Props> = ({ onNewGame, onAIOnlyGame, onCredits }) => {
  return (
    <div className={styles["menu-container"]}>
      <h1>Realms</h1>
      <div className={styles["buttons-container"]}>
        <MenuButton text="New Game" onClick={onNewGame} />
        <MenuButton text="AI Only Game" onClick={onAIOnlyGame} />
        <MenuButton text="Credits" onClick={onCredits} />
      </div>
    </div>
  );
};

export default Menu;
