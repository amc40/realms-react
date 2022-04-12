import HexTile from "../hex-tile";

class HillTile extends HexTile {
  private static readonly color = { r: 128, g: 128, b: 128 };
  private static readonly nMovementPoints = 2;

  constructor(radius: number, row: number, col: number) {
    super(radius, row, col, HillTile.color, HillTile.nMovementPoints);
  }
}

export default HillTile;
