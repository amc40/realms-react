import HexTile from "../grid/hex-tile";
import GameMap from "../grid/game-map";

class Portal {
  readonly firstMap: GameMap;
  readonly firstRow: number;
  readonly firstCol: number;

  readonly secondMap: GameMap;
  readonly secondRow: number;
  readonly secondCol: number;

  get firstTile(): HexTile {
    return this.firstMap.getTile(this.firstRow, this.firstCol)!;
  }

  get secondTile(): HexTile {
    return this.secondMap.getTile(this.secondRow, this.secondCol)!;
  }

  constructor(
    firstMap: GameMap,
    firstRow: number,
    firstCol: number,
    secondMap: GameMap,
    secondRow: number,
    secondCol: number
  ) {
    this.firstMap = firstMap;
    this.firstRow = firstRow;
    this.firstCol = firstCol;

    this.secondMap = secondMap;
    this.secondRow = secondRow;
    this.secondCol = secondCol;
  }

  getOtherEndMapAndTile(hexTile: HexTile): {
    map: GameMap;
    tile: HexTile;
  } {
    const firstTile = this.firstTile;
    const secondTile = this.secondTile;
    if (firstTile === hexTile) {
      return {
        map: this.secondMap,
        tile: secondTile,
      };
    } else {
      return {
        map: this.firstMap,
        tile: firstTile,
      };
    }
  }
}

export default Portal;
