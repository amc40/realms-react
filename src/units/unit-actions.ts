import p5 from "p5";
import { CivilUnitActionType } from "./civil/civil-unit";
import { MillitaryUnitActionType } from "./millitary/millitary-unit";

export type UnitActionType = CivilUnitActionType | MillitaryUnitActionType;

type ActionTypeIcons = {
  [key in UnitActionType]: p5.Image;
};

class UnitActions {
  private readonly unitActionIcons: ActionTypeIcons;

  public static getUnitActionIconUrl(actionType: UnitActionType) {
    switch (actionType) {
      case "move":
        return "/assets/actions/move.png";
      case "sleep":
        return "/assets/actions/sleep.png";
      case "transport":
        return "/assets/actions/transport.png";
      case "melee-attack":
        return "/assets/actions/attack.png";
      default:
        throw new Error("Unknown action type", actionType);
    }
  }

  constructor(p5: p5) {
    const move = p5.loadImage(UnitActions.getUnitActionIconUrl("move"));
    const sleep = p5.loadImage(UnitActions.getUnitActionIconUrl("sleep"));
    const transport = p5.loadImage(
      UnitActions.getUnitActionIconUrl("transport")
    );
    const meleeAttack = p5.loadImage(
      UnitActions.getUnitActionIconUrl("melee-attack")
    );
    this.unitActionIcons = {
      move,
      sleep,
      transport,
      "melee-attack": meleeAttack,
    };
  }

  getIcon(unitActionType: UnitActionType) {
    return this.unitActionIcons[unitActionType];
  }
}
