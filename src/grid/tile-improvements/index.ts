import p5 from "p5";
import FarmTileImprovement from "./farm-tile-improvement";
import MineTileImprovement from "./mine-tile.improvement";
import MonumentTileImprovement from "./monument-tile-improvement";
import TileImprovement from "./tile-improvement";

export type TileImprovementType = "farm" | "mine" | "monument";

export function getTileImprovementInstance(
  type: TileImprovementType,
  p5: p5
): TileImprovement | null {
  switch (type) {
    case "farm":
      return new FarmTileImprovement(p5);
    case "mine":
      return new MineTileImprovement(p5);
    case "monument":
      return new MonumentTileImprovement(p5);
    default:
      return null;
  }
}
