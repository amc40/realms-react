import { ResourceQuantity } from "../../resources";
import HexTile from "../hex-tile";

class MarshTile extends HexTile {
  private static readonly color = { r: 76, g: 116, b: 79 };
  private static readonly nMovementPoints = 2;
  private static readonly resources: ResourceQuantity = {
    food: 1,
  };

  constructor(radius: number, row: number, col: number) {
    super(
      "Marsh",
      radius,
      row,
      col,
      MarshTile.color,
      MarshTile.nMovementPoints,
      MarshTile.resources,
    );
  }
}

export default MarshTile;
