import Resources, { ResourceQuantity } from "../../resources";
import RGB from "../../utils/RGB";
import HexTile from "../hex-tile";
import { TileImprovementType } from "../tile-improvements";

class GrasslandTile extends HexTile {
  private static readonly color = {
    r: 161,
    g: 193,
    b: 120,
  };
  private static readonly resources: ResourceQuantity = {
    food: 2,
  };

  constructor(
    radius: number,
    row: number,
    col: number,
    resourceIconRepo: Resources,
    wood: number = 0
  ) {
    super(
      "Grassland",
      radius,
      row,
      col,
      GrasslandTile.color,
      1,
      GrasslandTile.resources,
      resourceIconRepo,
      {
        possibleTileImprovements: [
          "farm",
          ...(wood > 0 ? ["lumber-mill" as TileImprovementType] : []),
        ],
        extraResources: {
          wood,
        },
      }
    );
  }
}

export default GrasslandTile;
