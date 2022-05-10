import p5 from "p5";
import CircularButton from "../assets/circular-button";
import RealmsSketch from "../sketch/realms-sketch";
import { getSpacing } from "../utils/spacing";
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
      case "construct-farm":
        return "/assets/tile-improvements/farm.png";
      case "construct-mine":
        return "/assets/tile-improvements/mine.png";
      case "construct-lumber-mill":
        return "/assets/tile-improvements/lumber-mill.png";
      case "transfer-resources":
        return "/assets/actions/transfer-resources.png";
      case "settle-city":
        return "/assets/actions/settle.png";
      case "siege":
        return "/assets/actions/siege.png";
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
    const constructFarm = p5.loadImage(
      UnitActions.getUnitActionIconUrl("construct-farm")
    );
    const constructMine = p5.loadImage(
      UnitActions.getUnitActionIconUrl("construct-mine")
    );
    const constructLumberMill = p5.loadImage(
      UnitActions.getUnitActionIconUrl("construct-lumber-mill")
    );
    const transferResources = p5.loadImage(
      UnitActions.getUnitActionIconUrl("transfer-resources")
    );
    const settleCity = p5.loadImage(
      UnitActions.getUnitActionIconUrl("settle-city")
    );
    const siege = p5.loadImage(UnitActions.getUnitActionIconUrl("siege"));
    this.unitActionIcons = {
      move,
      sleep,
      transport,
      "melee-attack": meleeAttack,
      "construct-farm": constructFarm,
      "construct-mine": constructMine,
      "construct-lumber-mill": constructLumberMill,
      "transfer-resources": transferResources,
      "settle-city": settleCity,
      siege: siege,
    };
  }

  getIcon(unitActionType: UnitActionType) {
    return this.unitActionIcons[unitActionType];
  }

  getUnitActionButtons(
    unitActionsAndOnClick: UnitActionType[],
    sketch: RealmsSketch
  ): {
    type: UnitActionType;
    button: CircularButton;
  }[] {
    const unitActionButtonX = getSpacing(sketch.width / 2, 100, 3);
    const unitActionButtonRadius = 30;
    const unitActionButtonY = sketch.height - unitActionButtonRadius - 50;
    return unitActionsAndOnClick.map((unitActionType, index) => ({
      type: unitActionType,
      button: new CircularButton(
        () => sketch.handleUnitAction(unitActionType),
        unitActionButtonX[index],
        unitActionButtonY,
        unitActionButtonRadius,
        sketch,
        this.getIcon(unitActionType)
      ),
    }));
  }
}

export default UnitActions;
