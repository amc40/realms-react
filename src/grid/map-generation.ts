import p5 from "p5";
import City from "../cities/city";
import Player from "../players/player";
import Units from "../units";
import MillitaryUnit from "../units/millitary/millitary-unit";
import Swordsman from "../units/millitary/swordsman";
import Unit from "../units/unit";
import Map, { CubeCoordinate, OffsetCoordinate } from "./hex-grid";
import HexTile from "./hex-tile";
import CityTile from "./tiles/city";
import DesertTile from "./tiles/desert";
import GrasslandTile from "./tiles/grassland";
import HillTile from "./tiles/hills";
import MarshTile from "./tiles/marsh";
import PlainsTile from "./tiles/plains";

type TileType = "grassland" | "desert" | "marsh" | "hills" | "plains";
const tileTypes: TileType[] = [
  "grassland",
  "desert",
  "marsh",
  "hills",
  "plains",
];

class MapGenerator {
  private static readonly TILE_ADJACENCY_PROBABILITIES: {
    [key in TileType]: { [key in TileType]: number };
  } = {
    grassland: {
      grassland: 0.55,
      desert: 0.05,
      marsh: 0.1,
      hills: 0.15,
      plains: 0.15,
    },
    desert: {
      grassland: 0.2,
      desert: 0.6,
      marsh: 0,
      hills: 0.1,
      plains: 0.1,
    },
    marsh: {
      grassland: 0.3,
      desert: 0,
      marsh: 0.5,
      hills: 0,
      plains: 0.2,
    },
    hills: {
      grassland: 0.2,
      desert: 0.1,
      marsh: 0,
      hills: 0.5,
      plains: 0.2,
    },
    plains: {
      grassland: 0.3,
      desert: 0.05,
      marsh: 0.15,
      hills: 0,
      plains: 0.6,
    },
  };

  private readonly openCityModal: (city: City) => void;

  constructor(openCityModal: (city: City) => void) {
    this.openCityModal = openCityModal;
  }

  private static getPreviousGeneratedNeighbourOffsetCoords(
    row: number,
    col: number,
    nRows: number,
    nCols: number
  ): OffsetCoordinate[] {
    const neighbourCubeCoords: CubeCoordinate[] = [];
    const baseCube = new OffsetCoordinate(row, col).toCubeCoordinate();
    // add one and -1 to each of the q r and s
    neighbourCubeCoords.push(baseCube.add(0, -1, 1));
    neighbourCubeCoords.push(baseCube.add(1, -1, 0));
    neighbourCubeCoords.push(baseCube.add(-1, 0, 1));

    const offsetCoordinates = neighbourCubeCoords.map((cubeCoordinate) =>
      cubeCoordinate.toOffsetCoordinate()
    );
    const inBoundsOffsetCoordinates = offsetCoordinates.filter(
      (offsetCoordinate) => offsetCoordinate.inBounds(nRows, nCols)
    );
    return inBoundsOffsetCoordinates;
  }

  private static getGeneratedNeighbours(
    row: number,
    col: number,
    nRows: number,
    nCols: number,
    hexagonGrid: HexTile[][]
  ) {
    const neighbours = [];
    for (let neighbourOffsetCoord of MapGenerator.getPreviousGeneratedNeighbourOffsetCoords(
      row,
      col,
      nRows,
      nCols
    )) {
      const neighbour =
        hexagonGrid[neighbourOffsetCoord.row][neighbourOffsetCoord.col];
      neighbours.push(neighbour);
    }
    return neighbours;
  }

  private static hexTileToTileType(hexTile: HexTile): TileType {
    if (hexTile instanceof GrasslandTile) {
      return "grassland";
    } else if (hexTile instanceof DesertTile) {
      return "desert";
    } else if (hexTile instanceof HillTile) {
      return "hills";
    } else if (hexTile instanceof MarshTile) {
      return "marsh";
    } else if (hexTile instanceof PlainsTile) {
      return "plains";
    } else {
      throw new Error(`Unknown tile type: ${hexTile}`);
    }
  }

  private static getGeneratedNeighbourTileTypes(
    row: number,
    col: number,
    nRows: number,
    nCols: number,
    hexagonGrid: HexTile[][]
  ) {
    return this.getGeneratedNeighbours(row, col, nRows, nCols, hexagonGrid).map(
      MapGenerator.hexTileToTileType
    );
  }

  private static getTileTypeProbabilityDistribution(
    adjacentTileTypes: TileType[]
  ): {
    [key in TileType]: number;
  } {
    const tileTypeProbabilities: { [key in TileType]: number } = {
      grassland: 0,
      desert: 0,
      marsh: 0,
      hills: 0,
      plains: 0,
    };
    for (let adjacentTileType of adjacentTileTypes) {
      const unweightedAdjacencyProbabilities =
        MapGenerator.TILE_ADJACENCY_PROBABILITIES[adjacentTileType];
      for (let [tileType, unweightedProbability] of Object.entries(
        unweightedAdjacencyProbabilities
      )) {
        const weightedProbability =
          unweightedProbability / adjacentTileTypes.length;
        tileTypeProbabilities[tileType as TileType] += weightedProbability;
      }
    }
    return tileTypeProbabilities;
  }

  private static getTileOfType(
    tileType: TileType,
    radius: number,
    row: number,
    col: number
  ) {
    switch (tileType) {
      case "grassland":
        return new GrasslandTile(radius, row, col);
      case "desert":
        return new DesertTile(radius, row, col);
      case "marsh":
        return new MarshTile(radius, row, col);
      case "hills":
        return new HillTile(radius, row, col);
      case "plains":
        return new PlainsTile(radius, row, col);
      default:
        throw new Error(`Unknown tile type: ${tileType}`);
    }
  }

  private static getRadius(
    width: number,
    height: number,
    nRows: number,
    nCols: number
  ): number {
    const widthDiv = width / ((2 * nCols + 1) * Math.sqrt(2 / 3));
    const heightDiv = height / ((nRows - 1) * 1.5 + 2);
    return Math.min(widthDiv, heightDiv);
  }

  private static sampleProbabilities(probabilities: {
    [key in TileType]: number;
  }): TileType {
    const random = Math.random();
    let aggregated_probability = 0;
    const randomElement = Object.entries(probabilities)
      .map(([type, probability]) => {
        aggregated_probability += probability;
        return { type: type as TileType, probability: aggregated_probability };
      })
      .find(({ type, probability }) => probability >= random)?.type;
    if (randomElement != null) {
      return randomElement;
    }
    throw new Error(`Invalid probability distribution: ${probabilities}`);
  }

  private static getRandomRow(map: Map) {
    return Math.floor(Math.random() * map.nRows);
  }

  private static getRandomCol(map: Map) {
    return Math.floor(Math.random() * map.nCols);
  }

  private addPlayers(
    map: Map,
    players: Player[],
    nCities: number,
    tileRadius: number,
    units: Units
  ) {
    for (let player of players) {
      const unit = units.getSwordsman(player, (unit: Unit) =>
        map.onUnitKilled(unit)
      );
      const caravan = units.getCaravan(player, (unit: Unit) => {
        map.onUnitKilled(unit);
      });
      const worker = units.getWorker(player, (unit: Unit) => {
        map.onUnitKilled(unit);
      });
      // map.addUnit(
      //   unit,
      //   MapGenerator.getRandomRow(map),
      //   MapGenerator.getRandomCol(map)
      // );
      // map.addUnit(
      //   caravan,
      //   MapGenerator.getRandomRow(map),
      //   MapGenerator.getRandomCol(map)
      // );
      // map.addUnit(
      //   worker,
      //   MapGenerator.getRandomRow(map),
      //   MapGenerator.getRandomCol(map)
      // );

      for (let cityN = 0; cityN < nCities; cityN++) {
        const cityRow = MapGenerator.getRandomRow(map);
        const cityCol = MapGenerator.getRandomCol(map);
        map.addCityTile(
          new CityTile(
            tileRadius,
            cityRow,
            cityCol,
            new City("City " + (cityN + 1), player),
            this.openCityModal,
            (unit: Unit) => map.addUnit(unit, cityRow, cityCol)
          )
        );
      }
    }
  }

  generateMap(
    width: number,
    height: number,
    x: number,
    y: number,
    nRows: number,
    nCols: number,
    players: Player[],
    units: Units,
    p5: p5
  ): Map {
    const radius = 100;
    // random initial tile type
    const initialTileType =
      tileTypes[Math.floor(Math.random() * tileTypes.length)];
    const initialTile = MapGenerator.getTileOfType(
      initialTileType,
      radius,
      0,
      0
    );
    const hexagonGrid = new Array<Array<HexTile>>(nRows);
    for (let row = 0; row < nRows; row++) {
      hexagonGrid[row] = new Array<HexTile>(nCols);
    }
    hexagonGrid[0][0] = initialTile;
    for (let row = 0; row < nRows; row++) {
      for (let col = 0; col < nCols; col++) {
        // initial row is initialised manually
        if (!(row === 0 && col === 0)) {
          const generatedNeighbourTileTypes =
            MapGenerator.getGeneratedNeighbourTileTypes(
              row,
              col,
              nRows,
              nCols,
              hexagonGrid
            );
          const tileTypeProbabilities =
            MapGenerator.getTileTypeProbabilityDistribution(
              generatedNeighbourTileTypes
            );
          const tileType = MapGenerator.sampleProbabilities(
            tileTypeProbabilities
          );
          const tile = MapGenerator.getTileOfType(tileType, radius, row, col);
          hexagonGrid[row][col] = tile;
        }
      }
    }
    const hexGrid = new Map(
      width,
      height,
      x,
      y,
      nRows,
      nCols,
      radius,
      hexagonGrid
    );
    this.addPlayers(hexGrid, players, 3, radius, units);
    hexagonGrid[1][1].addTileImprovement(p5, "mine");
    return hexGrid;
  }
}

export default MapGenerator;
