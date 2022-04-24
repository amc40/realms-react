import Resources, { ResourceQuantity } from "../../resources";
import HexTile from "../hex-tile";

class PlainsTile extends HexTile {
  private static readonly color = {
    r: 138,
    g: 128,
    b: 56,
  };
  private static readonly nMovementPoints = 1;
  private static readonly resources: ResourceQuantity = {
    food: 1,
    production: 1,
  };

  constructor(
    radius: number,
    row: number,
    col: number,
    resourceIconRepo: Resources
  ) {
    super(
      "Plains",
      radius,
      row,
      col,
      PlainsTile.color,
      PlainsTile.nMovementPoints,
      PlainsTile.resources,
      resourceIconRepo,
      {
        possibleTileImprovements: ["farm"],
      }
    );
  }
}

export default PlainsTile;
