import HexTile from "../grid/hex-tile";
import Map from "../grid/map";

class Portal {
  readonly firstMap: Map;
  readonly firstRow: number;
  readonly firstCol: number;

  readonly secondMap: Map;
  readonly secondRow: number;
  readonly secondCol: number;

  get firstTile(): HexTile {
    return this.firstMap.getTile(this.firstRow, this.firstCol)!;
  }

  get secondTile(): HexTile {
    return this.secondMap.getTile(this.secondRow, this.secondCol)!;
  }

  constructor(
    firstMap: Map,
    firstRow: number,
    firstCol: number,
    secondMap: Map,
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
    map: Map;
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
