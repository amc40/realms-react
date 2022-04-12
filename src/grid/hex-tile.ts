import p5 from "p5";
import RegularHexagon from "../assets/regular-hexagon";
import Player from "../players/player";
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
    nMovementPoints: number
  ) {
    super(radius, color);
    this.row = row;
    this.col = col;
    this.nMovementPoints = nMovementPoints;
  }

  addNeighbour(neighbourHexTile: HexTile) {
    this.node.addEdge(
      new WeightedDirectedEdge<HexTile>(
        this.node,
        neighbourHexTile.node,
        this.nMovementPoints
      )
    );
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
}

export default HexTile;
