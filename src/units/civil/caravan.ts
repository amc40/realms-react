import p5 from "p5";
import Player from "../../players/player";
import Unit from "../unit";
import CivilUnit from "./civil-unit";

export type CaravanActionType = "transport" | "sleep";

class Caravan extends CivilUnit {
  private static nMovementPoints = 2;

  constructor(
    p5: p5,
    owner: Player,
    onKilled: (unit: Unit) => void,
    icon: p5.Image
  ) {
    super(p5, Caravan.nMovementPoints, owner, onKilled, icon);
  }
}

export default Caravan;
