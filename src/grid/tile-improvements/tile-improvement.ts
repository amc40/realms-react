import { ResourceQuantity } from "../../resources";
import ResourceQuantityDisplay from "../../resources/ResourceQuantityDisplay";
import HexTile from "../hex-tile";
import TileImprovementIcon from "./tile-improvement-icon";

class TileImprovement {
  readonly icon: TileImprovementIcon;
  readonly displayName: string;
  readonly getResourceYield: (hexTile: HexTile) => ResourceQuantity;

  constructor(
    displayName: string,
    getResourceYield: (hexTile: HexTile) => ResourceQuantity,
    icon: TileImprovementIcon
  ) {
    this.getResourceYield = getResourceYield;
    this.icon = icon;
    this.displayName = displayName;
  }
}

export default TileImprovement;
