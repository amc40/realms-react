import HexTile from "../hex-tile";

class MarshTile extends HexTile {
  private static readonly color = { r: 76, g: 116, b: 79 };
  private static readonly nMovementPoints = 2;

  constructor(radius: number, row: number, col: number) {
    super(radius, row, col, MarshTile.color, MarshTile.nMovementPoints);
  }
}

export default MarshTile;
