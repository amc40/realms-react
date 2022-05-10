import p5 from "p5";
import City from "../cities/city";
import Player from "../players/player";
import Units from "../units";
import MillitaryUnit from "../units/millitary/millitary-unit";
import Swordsman from "../units/millitary/swordsman";
import Unit from "../units/unit";
import GameMap, { CubeCoordinate, OffsetCoordinate } from "./game-map";
import HexTile from "./hex-tile";
import CityTile from "./tiles/city";
import DesertTile from "./tiles/desert";
import GrasslandTile from "./tiles/grassland";
import HillTile from "./tiles/hills";
import MarshTile from "./tiles/marsh";
import PlainsTile from "./tiles/plains";
import { randomElement, randomInt } from "../utils/random";
import PortalTile, { SelectMapAndCentreOn } from "./tiles/portal";
import Portal from "../portals/portal";
import FarmTileImprovement from "./tile-improvements/farm-tile-improvement";
import Resources from "../resources";
import RealmsSketch from "../sketch/realms-sketch";

type NaturalTileType = "grassland" | "desert" | "marsh" | "hills" | "plains";
const tileTypes: NaturalTileType[] = [
  "grassland",
  "desert",
  "marsh",
  "hills",
  "plains",
];

type AllTileTypes = NaturalTileType | "city" | "portal";

class MapGenerator {
  private static readonly TILE_ADJACENCY_PROBABILITIES: {
    [key in NaturalTileType]: { [key in NaturalTileType]: number };
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
  private readonly radius = 100;
  private readonly selectMapAndCentreOn: SelectMapAndCentreOn;
  private readonly resourceIcons: Resources;
  private readonly getCurrentSelectedUnit: () => Unit | null;
  private readonly setCurrentSelectedUnit: (unit: Unit | null) => void;

  constructor(
    openCityModal: (city: City) => void,
    selectMapAndCentreOn: SelectMapAndCentreOn,
    resourceIcons: Resources,
    getCurrentSelectedUnit: () => Unit | null,
    setCurrentSelectedUnit: (unit: Unit | null) => void
  ) {
    this.openCityModal = openCityModal;
    this.selectMapAndCentreOn = selectMapAndCentreOn;
    this.resourceIcons = resourceIcons;
    this.getCurrentSelectedUnit = getCurrentSelectedUnit;
    this.setCurrentSelectedUnit = setCurrentSelectedUnit;
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

  private static hexTileToTileType(hexTile: HexTile): NaturalTileType {
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
    adjacentTileTypes: NaturalTileType[]
  ): {
    [key in NaturalTileType]: number;
  } {
    const tileTypeProbabilities: { [key in NaturalTileType]: number } = {
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
        tileTypeProbabilities[tileType as NaturalTileType] +=
          weightedProbability;
      }
    }
    return tileTypeProbabilities;
  }

  private getTileOfType(
    tileType: NaturalTileType,
    row: number,
    col: number
  ): HexTile {
    switch (tileType) {
      case "grassland":
        const proportionWood = 0.3;
        const minWood = 3;
        const maxWood = 30;
        const wood =
          Math.random() < proportionWood ? randomInt(minWood, maxWood) : 0;

        return new GrasslandTile(
          this.radius,
          row,
          col,
          this.resourceIcons,
          wood
        );
      case "desert":
        return new DesertTile(this.radius, row, col, this.resourceIcons);
      case "marsh":
        return new MarshTile(this.radius, row, col, this.resourceIcons);
      case "hills":
        const proportionIron = 0.2;
        const minIron = 5;
        const maxIron = 30;
        const iron =
          Math.random() < proportionIron ? randomInt(minIron, maxIron) : 0;
        return new HillTile(this.radius, row, col, this.resourceIcons, iron);
      case "plains":
        return new PlainsTile(this.radius, row, col, this.resourceIcons);
      default:
        throw new Error("Unknown tile type", tileType);
    }
  }

  getCityTile(row: number, col: number, owner: Player, map: GameMap): CityTile {
    return new CityTile(
      this.radius,
      row,
      col,
      new City("City " + owner.incrementThenGetNCities(), owner),
      this.resourceIcons,
      this.openCityModal,
      (unit: Unit) => map.addUnit(unit, row, col)
    );
  }

  public getRadius() {
    return this.radius;
  }

  private static sampleProbabilities(probabilities: {
    [key in NaturalTileType]: number;
  }): NaturalTileType {
    const random = Math.random();
    let aggregated_probability = 0;
    const randomElement = Object.entries(probabilities)
      .map(([type, probability]) => {
        aggregated_probability += probability;
        return {
          type: type as NaturalTileType,
          probability: aggregated_probability,
        };
      })
      .find(({ type, probability }) => probability >= random)?.type;
    if (randomElement != null) {
      return randomElement;
    }
    throw new Error(`Invalid probability distribution: ${probabilities}`);
  }

  private static getRandomRow(map: GameMap) {
    return Math.floor(Math.random() * map.nRows);
  }

  private static getRandomCol(map: GameMap) {
    return Math.floor(Math.random() * map.nCols);
  }

  private addPlayers(
    sketch: RealmsSketch,
    map: GameMap,
    players: Player[],
    nCities: number,
    units: Units
  ) {
    for (let player of players) {
      let cities: CityTile[] = [];
      for (let cityN = 0; cityN < nCities; cityN++) {
        const cityRow = MapGenerator.getRandomRow(map);
        const cityCol = MapGenerator.getRandomCol(map);
        const cityTile = this.getCityTile(cityRow, cityCol, player, map);
        map.addCityTile(cityTile);
        cities.push(cityTile);
      }

      const onKilled = (unit: Unit) => sketch.onUnitKilled(unit);
      const unit = units.getSwordsman(player, onKilled);
      const caravan = units.getCaravan(player, onKilled);
      const worker = units.getWorker(player, onKilled);
      const settler = units.getSettler(player, onKilled);
      map.addUnit(
        unit,
        MapGenerator.getRandomRow(map),
        MapGenerator.getRandomCol(map)
      );
      // const randomCity = randomElement(cities)!;
      // map.addUnit(caravan, randomCity.getRow(), randomCity.getCol());
      // map.addUnit(
      //   worker,
      //   MapGenerator.getRandomRow(map),
      //   MapGenerator.getRandomCol(map)
      // );
      map.addUnit(
        settler,
        MapGenerator.getRandomRow(map),
        MapGenerator.getRandomCol(map)
      );
    }
  }

  addPortals(mainRealm: GameMap, otherRealm: GameMap, nPortals: number) {
    for (let portalN = 0; portalN < nPortals; portalN++) {
      const mainRealmPortalRow = MapGenerator.getRandomRow(mainRealm);
      const mainRealmPortalCol = MapGenerator.getRandomCol(mainRealm);
      const otherRealmPortalRow = MapGenerator.getRandomRow(otherRealm);
      const otherRealmPortalCol = MapGenerator.getRandomCol(otherRealm);
      const portal = new Portal(
        mainRealm,
        mainRealmPortalRow,
        mainRealmPortalCol,
        otherRealm,
        otherRealmPortalRow,
        otherRealmPortalCol
      );
      // TODO: entur: This is a hack to make sure the portal is not on top of a city
      const mainRealmPortalTile = new PortalTile(
        `${portalN + 1} ${otherRealm.realmName}`,
        portal,
        this.radius,
        mainRealmPortalRow,
        mainRealmPortalCol,
        this.resourceIcons,
        this.selectMapAndCentreOn
      );
      mainRealm.addPortalTile(mainRealmPortalTile);
      const otherRealmPortalTile = new PortalTile(
        `${portalN + 1} ${mainRealm.realmName}`,
        portal,
        this.radius,
        otherRealmPortalRow,
        otherRealmPortalCol,
        this.resourceIcons,
        this.selectMapAndCentreOn
      );
      otherRealm.addPortalTile(otherRealmPortalTile);
    }
  }

  generateMap(
    name: string,
    width: number,
    height: number,
    x: number,
    y: number,
    nRows: number,
    nCols: number
  ) {
    // random initial tile type
    const initialTileType =
      tileTypes[Math.floor(Math.random() * tileTypes.length)];
    const initialTile = this.getTileOfType(initialTileType, 0, 0);
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
          const tile = this.getTileOfType(tileType, row, col);
          hexagonGrid[row][col] = tile;
        }
      }
    }
    const map = new GameMap(
      name,
      width,
      height,
      x,
      y,
      nRows,
      nCols,
      this.radius,
      hexagonGrid,
      this.getCurrentSelectedUnit,
      this.setCurrentSelectedUnit
    );
    for (let row = 0; row < nRows; row++) {
      for (let col = 0; col < nCols; col++) {
        const tile = hexagonGrid[row][col];
        tile.setMap(map);
      }
    }
    return map;
  }

  generateMainRealmMap(
    width: number,
    height: number,
    x: number,
    y: number,
    nRows: number,
    nCols: number,
    players: Player[],
    units: Units,
    sketch: RealmsSketch
  ) {
    const map = this.generateMap("Terra", width, height, x, y, nRows, nCols);
    this.addPlayers(sketch, map, players, 3, units);
    map.getTile(1, 1)?.addTileImprovement(sketch, "farm");
    return map;
  }

  /**
   *
   * @param width the width of the sketch in pixels
   * @param height the height of the sketch in pixels
   * @param x the x coordinate of the top left corner of the map
   * @param y the u coordinate of the top left corner of the map
   * @param mainRealmNRows the number of rows of hexes in the main realm
   * @param mainRealmNCols the number of columns of hexes in the main realm
   * @param otherRealmsMinRows the minimum number of rows of hexes in other realms
   * @param otherRealmsMaxRows the maximum number of rows of hexes in other realms
   * @param otherRealmsMinCols the minimum number of columns of hexes in other realms
   * @param otherRealmsMaxCols the maximum number of columns of hexes in other realms
   * @param nOtherRealms the number of other realms
   * @param players the players in the game
   * @param units the units in the game
   * @param p5 the sketchdd
   */
  generateMaps(
    width: number,
    height: number,
    x: number,
    y: number,
    mainRealmNRows: number,
    mainRealmNCols: number,
    otherRealmsMinRows: number,
    otherRealmsMaxRows: number,
    otherRealmsMinCols: number,
    otherRealmsMaxCols: number,
    players: Player[],
    units: Units,
    sketch: RealmsSketch
  ): {
    mainRealm: GameMap;
    otherRealms: GameMap[];
  } {
    const nOtherRealms = players.length;
    const mainRealm = this.generateMainRealmMap(
      width,
      height,
      x,
      y,
      mainRealmNRows,
      mainRealmNCols,
      players,
      units,
      sketch
    );
    let otherRealms: GameMap[] = [];
    for (let i = 0; i < nOtherRealms; i++) {
      const nRows = randomInt(otherRealmsMinRows, otherRealmsMaxRows + 1);
      const nCols = randomInt(otherRealmsMinCols, otherRealmsMaxCols + 1);
      const otherRealm = this.generateMap(
        `Realm ${i + 1}`,
        width,
        height,
        x,
        y,
        nRows,
        nCols
      );
      otherRealms.push(otherRealm);
      this.addPortals(mainRealm, otherRealm, randomInt(1, 2));
    }
    return { mainRealm, otherRealms };
  }
}

export default MapGenerator;
