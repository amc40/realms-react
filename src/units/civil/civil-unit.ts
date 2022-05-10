import p5 from "p5";
import Player from "../../players/player";
import { ResourceQuantity } from "../../resources";
import { ResourceTransferSrc } from "../../resources/resource-transfer";
import Unit from "../unit";
import { CaravanActionType } from "./caravan";
import { SettlerActionType } from "./settler";
import { WorkerUnitActionType } from "./worker";

export type CivilUnitActionType =
  | CaravanActionType
  | WorkerUnitActionType
  | SettlerActionType;

abstract class CivilUnit extends Unit {
  private resources: ResourceQuantity = {};
  private icon: p5.Image;
  private iconRatio: number;

  constructor(
    p5: p5,
    nMovementPoints: number,
    owner: Player,
    onKilled: (unit: Unit) => void,
    icon: p5.Image,
    iconRatio = 0.9
  ) {
    super(p5, nMovementPoints, owner, onKilled);
    this.icon = icon;
    this.iconRatio = iconRatio;
  }

  addResources(resources: ResourceQuantity) {
    for (const _resource in resources) {
      const resource = _resource as keyof ResourceQuantity;
      this.resources[resource] =
        (this.resources[resource] || 0) + resources[resource]!;
    }
  }

  setResources(resources: ResourceQuantity) {
    this.resources = resources;
  }

  clearResources() {
    this.resources = {};
  }

  abstract getName(): string;

  getResouces() {
    return this.resources;
  }

  getTransferResourceSrc(): ResourceTransferSrc {
    return {
      resourceSrcName: this.getName(),
      resourceSrcQuantity: this.resources,
    };
  }

  draw(p5: p5): void {
    p5.ellipseMode(p5.CENTER);
    const { r, g, b } = this.owner.getColor();
    p5.stroke(0);
    p5.strokeWeight(3);
    p5.fill(r, g, b);
    p5.ellipse(0, 0, Unit.WIDTH, Unit.HEIGHT);
    p5.imageMode(p5.CENTER);
    p5.image(
      this.icon,
      0,
      0,
      Unit.WIDTH * this.iconRatio,
      Unit.HEIGHT * this.iconRatio
    );
  }
}

export default CivilUnit;
