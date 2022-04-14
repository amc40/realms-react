import { ResourceQuantity } from "../../resources";
import TileImprovementIcon from "./tile-improvement-icon";

class TileImprovement {
  readonly resourceYield: ResourceQuantity;
  readonly icon: TileImprovementIcon;
  constructor(resourceYield: ResourceQuantity, icon: TileImprovementIcon) {
    this.resourceYield = resourceYield;
    this.icon = icon;
  }
}

export default TileImprovement;
