import p5 from "p5";
import RegularHexagon from "../assets/regular-hexagon";
import City from "../cities/city";
import Player from "../players/player";
import Resources, {
  addResourceQuantities,
  ResourceQuantity,
} from "../resources";
import {
  SpecialResourceQuantity,
  SpecialResourceTypes,
} from "../resources/special-resources";
import Unit from "../units/unit";
import RGB from "../utils/RGB";
import ShortestPath, {
  Node,
  WeightedDirectedEdge,
} from "../utils/shortest-path";
import {
  getTileImprovementInstance,
  TileImprovementType,
} from "./tile-improvements";
import TileImprovement from "./tile-improvements/tile-improvement";
import TileImprovementIcon from "./tile-improvements/tile-improvement-icon";

abstract class HexTile extends RegularHexagon {
  private readonly node = new Node<HexTile>(this);
  private readonly row: number;
  private readonly col: number;
  // number of movement points required to move onto the tile
  private readonly nMovementPoints: number;
  protected city: City | null = null;
  private units: Unit[] = [];
  private currentUnit: Unit | null = null;
  private text: string | null;
  private tileImprovement: TileImprovement | null = null;
  private readonly baseResources: ResourceQuantity;
  private readonly specialResources: SpecialResourceQuantity;
  private readonly resourceIconRepo: Resources;
  private readonly textWidth = this.radius * 1.4;
  private readonly textHeight = 60;
  private _showAsValidTarget = false;
  readonly possibleTileImprovements: TileImprovementType[];
  readonly name: string;

  constructor(
    name: string,
    radius: number,
    row: number,
    col: number,
    color: RGB,
    nMovementPoints: number,
    baseResources: ResourceQuantity,
    resourceIconRepo: Resources,
    {
      possibleTileImprovements,
      city,
      text,
      extraResources,
    }: {
      possibleTileImprovements?: TileImprovementType[];
      city?: City;
      text?: string;
      extraResources?: SpecialResourceQuantity;
    } = {}
  ) {
    super(radius, color, 3);
    this.name = name;
    this.row = row;
    this.col = col;
    this.nMovementPoints = nMovementPoints;
    this.city = city ?? null;
    this.text = text ?? null;
    this.baseResources = baseResources;
    this.city?.addTile(this);
    this.possibleTileImprovements = possibleTileImprovements ?? [];
    this.specialResources = extraResources ?? {};
    this.resourceIconRepo = resourceIconRepo;
  }

  addUnit(unit: Unit) {
    console.log("adding ", unit, "to", this);
    this.units.push(unit);
    if (this.units.length === 1) {
      this.currentUnit = unit;
    }
  }

  getUnits() {
    return [...this.units];
  }

  getBorderColor(): RGB | null {
    return this.city?.owner.getColor() ?? null;
  }

  getInnerBorderColor(): RGB | null {
    if (this._showAsValidTarget) {
      return {
        r: 255,
        g: 0,
        b: 0,
      };
    }
    return null;
  }

  showAsValidTarget() {
    this._showAsValidTarget = true;
  }

  stopShowAsValidTarget() {
    this._showAsValidTarget = false;
  }

  removeUnit(unitToRemove: Unit) {
    console.log("removing unit", unitToRemove, "from", this);
    this.units = this.units.filter((unit) => unit !== unitToRemove);
    if (this.currentUnit === unitToRemove) {
      if (this.units.length > 0) {
        this.currentUnit = this.units[0];
      } else {
        this.currentUnit = null;
      }
    }
  }

  addNeighbour(neighbourHexTile: HexTile) {
    this.node.addEdge(
      new WeightedDirectedEdge<HexTile>(
        this.node,
        neighbourHexTile.node,
        neighbourHexTile.nMovementPoints
      )
    );
  }

  getNeighbours(): HexTile[] {
    return this.node.getNeighbours().map((neighbour) => neighbour.gamePoint);
  }

  movementCostTo(otherHexTile: HexTile) {
    return this.node.outEdges.find((edge) => edge.to === otherHexTile.node)
      ?.weight;
  }

  getRow() {
    return this.row;
  }

  getCol() {
    return this.col;
  }

  getNode() {
    return this.node;
  }

  setCity(city: City | null) {
    if (this.city != null) {
      this.city.removeTile(this);
    }
    this.city = city;
    if (city != null) {
      city.addTile(this);
    }
  }

  getCity() {
    return this.city;
  }

  public onClick(
    relativeMouseX: number,
    relativeMouseY: number,
    player: Player
  ): void {
    // cycle through units by default
    if (this.currentUnit === null) {
      this.currentUnit = this.units[0];
    } else {
      const currentUnitIndex = this.units.indexOf(this.currentUnit);
      this.currentUnit = this.units[(currentUnitIndex + 1) % this.units.length];
    }
  }

  getCurrentSelectedUnit() {
    // TODO: iterate through units using next and deselect
    return this.currentUnit;
  }

  hasOwner() {
    return this.city?.owner != null;
  }

  getOwner() {
    return this.city?.owner ?? null;
  }

  addTileImprovement(p5: p5, tileImprovementType: TileImprovementType) {
    this.tileImprovement = getTileImprovementInstance(tileImprovementType, p5);
  }

  getBaseResources() {
    return this.baseResources;
  }

  getTileImprovementResources(): ResourceQuantity | null {
    return this.tileImprovement?.getResourceYield(this) ?? null;
  }

  getTileImprovement() {
    return this.tileImprovement;
  }

  /**
   *
   * @returns {number} the number of resource per turn including the tile improvement
   */
  getAllResources(): ResourceQuantity {
    return addResourceQuantities(
      this.baseResources,
      this.tileImprovement?.getResourceYield(this) ?? {}
    );
  }

  minTextX() {
    return -this.textWidth / 2;
  }

  maxTextX() {
    return this.textWidth / 2;
  }

  minTextY() {
    return -this.textHeight / 2;
  }

  maxTextY() {
    return this.textHeight / 2;
  }

  protected intersectsWithText(
    xRelativeCentre: number,
    yRelativeCentre: number
  ): boolean {
    return (
      xRelativeCentre >= this.minTextX() &&
      xRelativeCentre <= this.maxTextX() &&
      yRelativeCentre >= this.minTextY() &&
      yRelativeCentre <= this.maxTextY()
    );
  }

  public drawBackground(p5: p5): void {
    super.draw(p5);
  }

  public getIconOffset() {
    return this.radius / 1.6;
  }

  public getFirstSpecialResource(): SpecialResourceTypes | null {
    const specialResources = Object.keys(
      this.specialResources
    ) as SpecialResourceTypes[];
    if (specialResources != null && specialResources.length > 0) {
      return (
        specialResources.find(
          (specialResource) => this.specialResources[specialResource]! > 0
        ) ?? null
      );
    }
    return null;
  }

  public getFirstSpecialResouceQuantity():
    | [SpecialResourceTypes, number]
    | null {
    const firstSpecialResouce = this.getFirstSpecialResource();
    if (firstSpecialResouce != null) {
      return [firstSpecialResouce, this.specialResources[firstSpecialResouce]!];
    } else {
      return null;
    }
  }

  hasSpecialResource(specialResource: SpecialResourceTypes) {
    return this.specialResources[specialResource] != null;
  }

  private drawSpecialResource(p5: p5, specialResource: SpecialResourceTypes) {
    p5.ellipseMode(p5.CENTER);
    const ellipseDiameter = 35;
    p5.ellipse(0, 0, ellipseDiameter, ellipseDiameter);
    const specialResourceIcon = this.resourceIconRepo.icons[specialResource];
    p5.imageMode(p5.CENTER);
    const iconDiameter = ellipseDiameter * 0.8;
    p5.image(specialResourceIcon, 0, 0, iconDiameter, iconDiameter);
  }

  public drawUnitsAndText(p5: p5): void {
    if (this.text) {
      p5.rectMode(p5.CENTER);
      p5.fill(255);
      p5.stroke(0);
      p5.strokeWeight(1.5);
      p5.rect(0, 0, this.textWidth, this.textHeight);
      p5.push();
      p5.strokeWeight(1);
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textSize(18);
      p5.text(this.text, 0, 0);
      p5.pop();
    }
    this.tileImprovement?.icon.draw(p5);
    p5.push();
    p5.translate(0, -this.getIconOffset());
    if (this.currentUnit != null) {
      this.currentUnit.draw(p5);
      if (this.units.length > 1) {
        this.currentUnit.drawAdditionalUnitsIcon(p5);
      }
    }
    p5.pop();
    p5.push();
    p5.translate(0, this.getIconOffset());
    const specialResource = this.getFirstSpecialResource();
    if (specialResource != null) {
      this.drawSpecialResource(p5, specialResource);
    }
    p5.pop();
  }
}

export default HexTile;
