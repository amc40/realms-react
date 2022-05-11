import React from "react";
import { Modal } from "react-bootstrap";

export type EndGameStatus = "won" | "lost" | "stalemate";

type Props = {
  status?: EndGameStatus;
  onHide: () => void;
};

const statusTitle = {
  won: "You won!",
  lost: "You were defeated",
  stalemate: "Oh dear, a stalemate!",
};

const statusText = {
  won: "You have won the game by conquering all your enemies. Enjoy the spoils of your conquest.",
  lost: "You have been defeated by your enemies. Better luck next time.",
  stalemate:
    "The new realms ran out of resources before you were able to conquer all your enemies. Try be quicker next time.",
};

const EndOfGameModal: React.FC<Props> = ({ status, onHide }) => {
  return (
    <Modal show={status != null} onHide={onHide}>
      {status != null && (
        <>
          <Modal.Header closeButton>
            <Modal.Title>{statusTitle[status]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ textAlign: "center" }}>{statusText[status]}</p>
          </Modal.Body>
        </>
      )}
    </Modal>
  );
};

export default EndOfGameModal;
