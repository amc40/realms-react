import p5 from "p5";
import { ResourceQuantity } from "../../resources";
import TileImprovement from "./tile-improvement";
import TileImprovementIcon from "./tile-improvement-icon";

class FarmTileImprovementIcon extends TileImprovementIcon {
  static readonly iconPath = "assets/tile-improvements/farm.png";

  constructor(p5: p5) {
    super("farm", p5.loadImage(FarmTileImprovementIcon.iconPath));
  }
}

class FarmTileImprovement extends TileImprovement {
  static readonly resourceYield: ResourceQuantity = {
    food: 2,
  };

  constructor(p5: p5) {
    super("Farm", FarmTileImprovement.resourceYield, new FarmTileImprovementIcon(p5));
  }
}

export default FarmTileImprovement;
