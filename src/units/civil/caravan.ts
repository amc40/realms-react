import p5 from "p5";
import Player from "../../players/player";
import Unit from "../unit";
import { UnitActionType } from "../unit-actions";
import CivilUnit from "./civil-unit";

export type CaravanActionType = "transport" | "sleep";

class Caravan extends CivilUnit {
  private static nMovementPoints = 2;
  private selectingTransportTarget = false;

  constructor(
    p5: p5,
    owner: Player,
    onKilled: (unit: Unit) => void,
    icon: p5.Image
  ) {
    super(p5, Caravan.nMovementPoints, owner, onKilled, icon);
  }

  havingTransportTargetSelected() {
    return this.selectingTransportTarget;
  }

  startSelectingTransportTarget() {
    this.selectingTransportTarget = true;
  }

  stopSelectingTransportTarget() {
    this.selectingTransportTarget = false;
  }

  getUnitActionTypes(): UnitActionType[] {
    return ["transport", "sleep"];
  }
}

export default Caravan;
