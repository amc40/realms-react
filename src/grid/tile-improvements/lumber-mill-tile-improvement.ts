import TileImprovement from "./tile-improvement";
import p5 from "p5";
import TileImprovementIcon from "./tile-improvement-icon";
import { ResourceQuantity } from "../../resources";
import HexTile from "../hex-tile";

class LumberMillTileImprovementIcon extends TileImprovementIcon {
  static readonly iconPath = "assets/tile-improvements/lumber-mill.png";

  constructor(p5: p5) {
    super("lumber-mill", p5.loadImage(LumberMillTileImprovementIcon.iconPath));
  }
}

class LumberMillTileImprovement extends TileImprovement {
  constructor(p5: p5) {
    super(
      "Lumber Mill",
      (hex: HexTile) => {
        return {
          production: 1,
          wood: hex.hasSpecialResource("wood") ? 1 : 0,
        };
      },
      new LumberMillTileImprovementIcon(p5)
    );
  }
}

export default LumberMillTileImprovement;
