import p5 from "p5";
import RegularHexagon from "../assets/regular-hexagon";
import Player from "../players/player";
import { ResourceQuantity } from "../resources";
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
  private owner: Player | null = null;
  private _unit: Unit | null = null;
  private text: string | null;
  private tileImprovement: TileImprovement | null = null;
  private readonly baseResources: ResourceQuantity;

  constructor(
    radius: number,
    row: number,
    col: number,
    color: RGB,
    nMovementPoints: number,
    baseResources: ResourceQuantity,
    owner: Player | null = null,
    text: string | null = null
  ) {
    super(radius, color, owner?.getColor() ?? null, 3);
    this.row = row;
    this.col = col;
    this.nMovementPoints = nMovementPoints;
    this.owner = owner;
    this.text = text;
    this.baseResources = baseResources;
  }

  get unit() {
    return this._unit;
  }

  set unit(unit: Unit | null) {
    this._unit = unit;
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

  getCurrentSelectedUnit() {
    // TODO: iterate through units using next and deselect
    return this.unit;
  }

  handleDelelected() {
    // TODO: deselect unit
    if (this.unit) {
      this.unit.toggleSelected();
      this.unit = null;
    }
  }

  handleReselected() {
    // TODO: cycle through units
  }

  removeUnit(unit: Unit) {
    if (this.unit === unit) {
      this.unit = null;
    }
  }

  addUnit(unit: Unit) {
    if (this.unit != null) {
      console.warn("possibly lossy remove of unit when adding another");
    }
    this.unit = unit;
  }

  hasOwner() {
    return this.owner != null;
  }

  getOwner() {
    return this.owner;
  }

  setOwner(owner: Player | null) {
    this.owner = owner;
    if (owner != null) {
      this.borderColor = owner.getColor();
    }
  }

  addTileImprovement(p5: p5, tileImprovementType: TileImprovementType) {
    this.tileImprovement = getTileImprovementInstance(tileImprovementType, p5);
  }

  getResources(): ResourceQuantity {
    // TODO: add tile improvement resources
    return this.baseResources;
  }

  public draw(p5: p5): void {
    super.draw(p5);
    if (this.text) {
      p5.rectMode(p5.CENTER);
      p5.fill(255);
      p5.stroke(0);
      p5.strokeWeight(1.5);
      p5.rect(0, 0, this.radius * 2 - 30, 30);
      p5.push();
      p5.strokeWeight(1);
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(this.text, 0, 0);
      p5.pop();
    }
    this.tileImprovement?.icon.draw(p5);
    this._unit?.draw(p5);
  }
}

export default HexTile;
