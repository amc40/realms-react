import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "react-bootstrap";
import GameMap from "../../grid/game-map";
import NextTurn from "../next-turn";
import styles from "./RealmScroller.module.css";

interface Props {
  currentMap: GameMap;
  onLeft: () => void;
  onRight: () => void;
}

const RealmScroller: React.FC<Props> = ({ currentMap, onLeft, onRight }) => {
  return (
    <div
      className={styles["realm-scroller-container"]}
      style={{ right: 2 * NextTurn.MARGIN + NextTurn.OUTER_RADIUS * 2 }}
    >
      <button
        className={styles["realm-scroller-button"]}
        onClick={(e) => {
          onLeft();
          e.stopPropagation();
        }}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <span>{currentMap.realmName}</span>
      <button
        className={styles["realm-scroller-button"]}
        onClick={(e) => {
          onRight();
          e.stopPropagation();
        }}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
};

export default RealmScroller;
