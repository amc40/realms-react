import RGB from "../../utils/RGB";
import HexTile from "../hex-tile";

class GrasslandTile extends HexTile {
  private static readonly color = {
    r: 161,
    g: 193,
    b: 120,
  };

  constructor(radius: number, row: number, col: number) {
    super(radius, row, col, GrasslandTile.color, 1);
  }
}

export default GrasslandTile;
