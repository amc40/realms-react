import p5 from "p5";
import { ResourceQuantity } from "../../resources";
import TileImprovement from "./tile-improvement";
import TileImprovementIcon from "./tile-improvement-icon";

class MonumentTileImprovementIcon extends TileImprovementIcon {
  static readonly iconPath = "assets/tile-improvements/architecture.png";

  constructor(p5: p5) {
    super("monument", p5.loadImage(MonumentTileImprovementIcon.iconPath));
  }
}

class MonumentTileImprovement extends TileImprovement {
  static readonly resourceYield: ResourceQuantity = {
    // culture: 1,
  };

  constructor(p5: p5) {
    super(
      MonumentTileImprovement.resourceYield,
      new MonumentTileImprovementIcon(p5)
    );
  }
}

export default MonumentTileImprovement;
