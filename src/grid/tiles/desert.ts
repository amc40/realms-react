import HexTile from "../hex-tile";

class DesertTile extends HexTile {
  private static readonly color = { r: 220, g: 164, b: 68 };
  private static readonly nMovementPoints = 1;

  constructor(radius: number, row: number, col: number) {
    super(radius, row, col, DesertTile.color, DesertTile.nMovementPoints);
  }
}

export default DesertTile;
