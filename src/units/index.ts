import p5 from "p5";
import Player from "../players/player";
import Swordsman from "./millitary/swordsman";
import Unit from "./unit";

export type UnitType = "swordsman";

class Units {
  swordsmanIcon: p5.Image;
  private p5: p5;

  public static getIconUrl(unitType: UnitType) {
    switch (unitType) {
      case "swordsman":
        return "/assets/units/millitary/swordsman.png";
      default:
        throw new Error("Unknown unit type", unitType);
    }
  }

  constructor(p5: p5) {
    this.p5 = p5;
    this.swordsmanIcon = p5.loadImage(Units.getIconUrl("swordsman"));
  }

  public getSwordsman(owner: Player, onKilled: (unit: Unit) => void) {
    return new Swordsman(this.p5, owner, onKilled, this.swordsmanIcon);
  }

  public getUnit(
    unitType: UnitType,
    owner: Player,
    onKilled: (unit: Unit) => void
  ) {
    switch (unitType) {
      case "swordsman":
        return this.getSwordsman(owner, onKilled);
      default:
        throw new Error("Unknown unit type", unitType);
    }
  }
}

export default Units;
