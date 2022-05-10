import p5 from "p5";
import Player from "../players/player";
import Caravan from "./civil/caravan";
import Settler from "./civil/settler";
import WorkerUnit from "./civil/worker";
import Swordsman from "./millitary/swordsman";
import Unit from "./unit";

export type UnitType = "swordsman" | "caravan" | "worker" | "settler";

class Units {
  swordsmanIcon: p5.Image;
  caravanIcon: p5.Image;
  workerIcon: p5.Image;
  settlerIcon: p5.Image;
  private p5: p5;

  public static getIconUrl(unitType: UnitType) {
    switch (unitType) {
      case "swordsman":
        return "/assets/units/millitary/swordsman.png";
      case "caravan":
        return "/assets/units/civil/caravan.png";
      case "worker":
        return "/assets/units/civil/worker.png";
      case "settler":
        return "/assets/units/civil/settler.png";
      default:
        throw new Error("Unknown unit type", unitType);
    }
  }

  constructor(p5: p5) {
    this.p5 = p5;
    this.swordsmanIcon = p5.loadImage(Units.getIconUrl("swordsman"));
    this.caravanIcon = p5.loadImage(Units.getIconUrl("caravan"));
    this.workerIcon = p5.loadImage(Units.getIconUrl("worker"));
    this.settlerIcon = p5.loadImage(Units.getIconUrl("settler"));
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

  public getSettler(owner: Player, onKilled: (unit: Unit) => void) {
    return new Settler(this.p5, owner, onKilled, this.settlerIcon);
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
      case "settler":
        return this.getSettler(owner, onKilled);
      default:
        throw new Error("Unknown unit type", unitType);
    }
  }
}

export default Units;
