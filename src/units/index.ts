import p5 from "p5";
import Player from "../players/player";
import Caravan from "./civil/caravan";
import WorkerUnit from "./civil/worker";
import Swordsman from "./millitary/swordsman";
import Unit from "./unit";

export type UnitType = "swordsman" | "caravan" | "worker";

class Units {
  swordsmanIcon: p5.Image;
  caravanIcon: p5.Image;
  workerIcon: p5.Image;
  private p5: p5;

  public static getIconUrl(unitType: UnitType) {
    switch (unitType) {
      case "swordsman":
        return "/assets/units/millitary/swordsman.png";
      case "caravan":
        return "/assets/units/civil/caravan.png";
      case "worker":
        return "/assets/units/civil/worker.png";
      default:
        throw new Error("Unknown unit type", unitType);
    }
  }

  constructor(p5: p5) {
    this.p5 = p5;
    this.swordsmanIcon = p5.loadImage(Units.getIconUrl("swordsman"));
    this.caravanIcon = p5.loadImage(Units.getIconUrl("caravan"));
    this.workerIcon = p5.loadImage(Units.getIconUrl("worker"));
  }

  public getSwordsman(owner: Player, onKilled: (unit: Unit) => void) {
    return new Swordsman(this.p5, owner, onKilled, this.swordsmanIcon);
  }

  public getCaravan(owner: Player, onKilled: (unit: Unit) => void) {
    return new Caravan(this.p5, owner, onKilled, this.caravanIcon);
  }

  public getWorker(owner: Player, onKilled: (unit: Unit) => void) {
    return new WorkerUnit(this.p5, owner, onKilled, this.workerIcon);
  }

  public getUnit(
    unitType: UnitType,
    owner: Player,
    onKilled: (unit: Unit) => void
  ) {
    switch (unitType) {
      case "swordsman":
        return this.getSwordsman(owner, onKilled);
      case "caravan":
        return this.getCaravan(owner, onKilled);
      case "worker":
        return this.getWorker(owner, onKilled);
      default:
        throw new Error("Unknown unit type", unitType);
    }
  }
}

export default Units;
