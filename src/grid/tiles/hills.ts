import Resources, { ResourceQuantity } from "../../resources";
import HexTile from "../hex-tile";

class HillTile extends HexTile {
  private static readonly color = { r: 128, g: 128, b: 128 };
  private static readonly nMovementPoints = 2;
  private static readonly resources: ResourceQuantity = {
    production: 2,
  };

  constructor(radius: number, row: number, col: number, resourceIconRepo: Resources, iron: number = 0) {
    super(
      "Hills",
      radius,
      row,
      col,
      HillTile.color,
      HillTile.nMovementPoints,
      HillTile.resources,
      resourceIconRepo,
      {
        possibleTileImprovements: ["mine"],
        extraResources: {
          iron,
        },
      }
    );
  }
}

export default HillTile;
