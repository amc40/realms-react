import { ResourceQuantity } from "../../resources";
import TileImprovementIcon from "./tile-improvement-icon";

class TileImprovement {
  readonly resourceYield: ResourceQuantity;
  readonly icon: TileImprovementIcon;
  readonly displayName: string;

  constructor(
    displayName: string,
    resourceYield: ResourceQuantity,
    icon: TileImprovementIcon
  ) {
    this.resourceYield = resourceYield;
    this.icon = icon;
    this.displayName = displayName;
  }
}

export default TileImprovement;
