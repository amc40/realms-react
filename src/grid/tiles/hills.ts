import { ResourceQuantity } from "../../resources";
import HexTile from "../hex-tile";

class HillTile extends HexTile {
  private static readonly color = { r: 128, g: 128, b: 128 };
  private static readonly nMovementPoints = 2;
  private static readonly resources: ResourceQuantity = {
    production: 2,
  };

  constructor(radius: number, row: number, col: number) {
    super(
      radius,
      row,
      col,
      HillTile.color,
      HillTile.nMovementPoints,
      HillTile.resources,
      {
        possibleTileImprovements: ["mine"],
      }
    );
  }
}

export default HillTile;
