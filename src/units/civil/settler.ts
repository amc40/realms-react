import p5 from "p5";
import GameMap from "../../grid/game-map";
import HexTile from "../../grid/hex-tile";
import Player from "../../players/player";
import Unit from "../unit";
import { UnitActionType } from "../unit-actions";
import CivilUnit from "./civil-unit";

export type SettlerActionType = "settle-city" | "move" | "sleep";

class Settler extends CivilUnit {
  private static nMovementPoints = 2;

  constructor(
    p5: p5,
    owner: Player,
    onKilled: (unit: Unit) => void,
    icon: p5.Image
  ) {
    super(p5, Settler.nMovementPoints, owner, onKilled, icon);
  }

  static canSettleOn(tile: HexTile): boolean {
    // on other cities within 3 tiles
    return tile.findNearestCityTile(3) == null;
  }

  static getSettelableTiles(map: GameMap): HexTile[] {
    const possibleIndices = new Set<[number, number]>();
    for (let row = 0; row < map.nRows; row++) {
      for (let col = 0; col < map.nCols; col++) {
        possibleIndices.add([row, col]);
      }
    }
    for (let cityTile of map.getCityTiles()) {
      cityTile.getAllTilesWithinDistance(3).forEach((tile) => {
        possibleIndices.delete([tile.getRow(), tile.getCol()]);
      });
    }
    return Array.from(possibleIndices).map(
      ([row, col]) => map.getTile(row, col)!
    );
  }

  getCurrentPossibleUnitActionTypes(): UnitActionType[] {
    let unitActions: UnitActionType[] = ["move", "sleep"];
    if (this.currentTile != null && Settler.canSettleOn(this.currentTile)) {
      unitActions.push("settle-city");
    }
    return unitActions;
  }

  getName(): string {
    return "Settler";
  }

  onSettleCity() {
    this.onKilled();
  }
}

export default Settler;
