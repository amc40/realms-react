import p5 from "p5";
import Player from "../../players/player";
import Unit from "../unit";
import { UnitActionType } from "../unit-actions";
import CivilUnit from "./civil-unit";

export type WorkerUnitActionType = "move" | "sleep";

class WorkerUnit extends CivilUnit {
  private static nMovementPoints = 2;

  constructor(
    p5: p5,
    owner: Player,
    onKilled: (unit: Unit) => void,
    icon: p5.Image
  ) {
    super(p5, WorkerUnit.nMovementPoints, owner, onKilled, icon, 0.8);
  }

  getUnitActionTypes(): UnitActionType[] {
    return ["move", "sleep"];
  }

}

export default WorkerUnit;
