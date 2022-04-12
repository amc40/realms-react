import HexTile from "../hex-tile";

class PlainsTile extends HexTile {
  private static readonly color = {
    r: 138,
    g: 128,
    b: 56,
  };
  private static readonly nMovementPoints = 1;

  constructor(radius: number, row: number, col: number) {
    super(radius, row, col, PlainsTile.color, PlainsTile.nMovementPoints);
  }
}

export default PlainsTile;
