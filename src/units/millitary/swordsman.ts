import MillitaryUnit from "./millitary-unit";
import p5 from "p5";
import Unit from "../unit";
import Player from "../../players/player";

class Swordsman extends MillitaryUnit {
  private static strength = 10;
  private static nMovementPoints = 2;

  constructor(
    p5: p5,
    owner: Player,
    onKilled: (unit: Unit) => void,
    icon: p5.Image
  ) {
    super(
      Swordsman.strength,
      Swordsman.nMovementPoints,
      p5,
      owner,
      onKilled,
      icon
    );
  }
}

export default Swordsman;
