import p5 from "p5";
import { ResourceQuantity } from "../../resources";
import TileImprovement from "./tile-improvement";
import TileImprovementIcon from "./tile-improvement-icon";

class MineTileImprovementIcon extends TileImprovementIcon {
  static readonly iconPath = "assets/tile-improvements/mine.png";

  constructor(p5: p5) {
    super("mine", p5.loadImage(MineTileImprovementIcon.iconPath));
  }
}

class MineTileImprovement extends TileImprovement {
  static readonly resourceYield: ResourceQuantity = {
    production: 2,
  };

  constructor(p5: p5) {
    super(MineTileImprovement.resourceYield, new MineTileImprovementIcon(p5));
  }
}

export default MineTileImprovement;
