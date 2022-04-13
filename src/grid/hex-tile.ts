import p5 from "p5";
import RegularHexagon from "../assets/regular-hexagon";
import Player from "../players/player";
import Unit from "../units/unit";
import RGB from "../utils/RGB";
import ShortestPath, {
  Node,
  WeightedDirectedEdge,
} from "../utils/shortest-path";

abstract class HexTile extends RegularHexagon {
  private readonly node = new Node<HexTile>(this);
  private readonly row: number;
  private readonly col: number;
  // number of movement points required to move onto the tile
  private readonly nMovementPoints: number;
  private owner: Player | null = null;

  constructor(
    radius: number,
    row: number,
    col: number,
    color: RGB,
    nMovementPoints: number,
    owner: Player | null = null,
    text: string | null = null
  ) {
    super(radius, color, owner?.getColor() ?? null, text);
    this.row = row;
    this.col = col;
    this.nMovementPoints = nMovementPoints;
    this.owner = owner;
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
}

export default HexTile;
