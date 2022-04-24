import p5 from "p5";
import { ResourceQuantity } from "../../resources";
import HexTile from "../hex-tile";
import TileImprovement from "./tile-improvement";
import TileImprovementIcon from "./tile-improvement-icon";

class MineTileImprovementIcon extends TileImprovementIcon {
  static readonly iconPath = "assets/tile-improvements/mine.png";

  constructor(p5: p5) {
    super("mine", p5.loadImage(MineTileImprovementIcon.iconPath));
  }
}

class MineTileImprovement extends TileImprovement {
  static readonly baseResourceYield: ResourceQuantity = {
    production: 2,
  };

  constructor(p5: p5) {
    super(
      "Mine",
      (hex: HexTile) => {
        return {
          ...MineTileImprovement.baseResourceYield,
          iron: hex.hasSpecialResource("iron") ? 1 : 0,
        };
      },
      new MineTileImprovementIcon(p5)
    );
  }
}

export default MineTileImprovement;
