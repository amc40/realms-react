import p5 from "p5";
import Player from "../../players/player";
import Unit from "../unit";
import { UnitActionType } from "../unit-actions";
import CivilUnit from "./civil-unit";

export type WorkerUnitActionType =
  | "move"
  | "sleep"
  | "construct-farm"
  | "construct-mine";

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
    let possibleActionTypes: UnitActionType[] = [];
    if (this.currentTile?.possibleTileImprovements.includes("farm")) {
      possibleActionTypes.push("construct-farm");
    }
    if (this.currentTile?.possibleTileImprovements.includes("mine")) {
      possibleActionTypes.push("construct-mine");
    }
    possibleActionTypes.push("move", "sleep");
    return possibleActionTypes;
  }
}

export default WorkerUnit;
