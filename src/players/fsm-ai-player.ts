import City from "../cities/city";
import { ProductionItem, ProductionItemName } from "../cities/production";
import GameMap from "../grid/game-map";
import HexTile from "../grid/hex-tile";
import CityTile from "../grid/tiles/city";
import GrasslandTile from "../grid/tiles/grassland";
import HillTile from "../grid/tiles/hills";
import PlainsTile from "../grid/tiles/plains";
import PortalTile from "../grid/tiles/portal";
import RealmsSketch from "../sketch/realms-sketch";
import Settler from "../units/civil/settler";
import MillitaryUnit from "../units/millitary/millitary-unit";
import Unit from "../units/unit";
import { randomElement } from "../utils/random";
import AIPlayer from "./ai-player";

// different states the AI player can be in.

// control-portals: aim to grab as many portals as possible.
// colonise-realms: defend the portals we already have and build setters to settle cities in the other realms.
// attack-opponents: once have gathered enough resources that we think we can attack an opponent do so.
// stockpile-and-prepare: defend the current assets and send back the resources from the other realms to the main realm in order to construct more units.
type State =
  | "control-portals"
  | "colonise-realms"
  | "attack-opponents"
  | "stockpile-and-prepare"
  | "defend-from-attack";

type ProductionPreference = ProductionItemName[];

class FSMAIPlayer extends AIPlayer {
  state: State = "control-portals";

  productionPreferenceControlPortals(): ProductionPreference {
    let productionPreference: ProductionPreference = [];
    // low cost troops
    // prefer spearmen if possible as uses up dramatically less population
    productionPreference.push("Spearman");
    productionPreference.push("Millitia");
    productionPreference.push("Swordsman");
    return productionPreference;
  }

  getUndefendedPortalsInMainRealm(gameSketch: RealmsSketch) {
    const portalTilesInTerritory =
      gameSketch.getMainRealmPortalTilesBelongingToPlayer(this);
    const undefendedPortalTilesInTerritory = portalTilesInTerritory.filter(
      (tile) => !tile.containsMillitaryUnit()
    );
    return undefendedPortalTilesInTerritory;
  }

  productionPreferenceColoniseRealms(
    gameSketch: RealmsSketch
  ): ProductionPreference {
    let productionPreference: ProductionPreference = [];
    const undefendedPortalsInMainRealm =
      this.getUndefendedPortalsInMainRealm(gameSketch);
    if (undefendedPortalsInMainRealm.length > 0) {
      // produce a millitary unit to defend it
      productionPreference.push("Spearman");
      productionPreference.push("Millitia");
      productionPreference.push("Swordsman");
    }
    // otherwise produce a settler
    productionPreference.push("Settler");
    return productionPreference;
  }

  makeProductionChoice(
    productionPreferences: ProductionPreference,
    possibleProductionItems: ProductionItem[]
  ) {
    for (let productionPreference of productionPreferences) {
      const productionItem = possibleProductionItems.find(
        (item) => item.name === productionPreference
      );
      if (productionItem != null) {
        return productionItem;
      }
    }
    return randomElement(possibleProductionItems)!;
  }

  chooseCityProduction(
    gameSketch: RealmsSketch,
    possibleProductionItems: ProductionItem[],
    city: City
  ): ProductionItem {
    switch (this.state) {
      case "control-portals":
        return this.makeProductionChoice(
          this.productionPreferenceControlPortals(),
          possibleProductionItems
        );
      case "colonise-realms":
        return this.makeProductionChoice(
          this.productionPreferenceColoniseRealms(gameSketch),
          possibleProductionItems
        );
    }
    throw new Error("unreachable");
  }

  goToNearestPointOfSafety(
    unit: Unit,
    unitCurrentTile: HexTile,
    unitCurrentMap: GameMap
  ) {
    // return to nearest city
    // find the closest city tile
    const closestCityTile = unitCurrentMap.getClosestCityTo(
      unitCurrentTile,
      unit.owner
    );
    if (closestCityTile != null) {
      unit.movementTarget = closestCityTile;
      unit.selectCurrentMovementTarget();
      return true;
    } else {
      // just hunked down and hope
      // TODO: maybe seek out closest millitary unit
      unit.setSleeping();
      return true;
    }
  }

  flee() {}

  attack() {}

  defendClosestUndefendedPortalTile(unit: Unit) {
    const closestUndefendedPortalTile =
      unit?.currentTile?.findTileMatchingPredicate(
        (tile) => tile instanceof PortalTile && !tile.containsMillitaryUnit(),
        10,
        true
      );
    if (closestUndefendedPortalTile != null) {
      unit.movementTarget = closestUndefendedPortalTile;
      unit.selectCurrentMovementTarget();
      return true;
    }
    return false;
  }

  chooseUnitActionControlPortals(gameSketch: RealmsSketch, unit: Unit) {
    const unitCurrentTile = unit.currentTile;
    const unitCurrentMap = unitCurrentTile?.getMap();
    if (unit instanceof MillitaryUnit) {
      // move to defend a portal if necessary.
      if (unitCurrentTile instanceof PortalTile) {
        unit.setSleeping();
        return;
      } else {
        // try to find an undefended portal tile within 10 tiles
        if (this.defendClosestUndefendedPortalTile(unit)) {
          return true;
        }
        // TODO: potentially move to colonise state
        this.state = "colonise-realms";
        console.log("starting to colonise realms");
        unit.setSleeping();
        return;
      }
    } else {
      // if not already in a city then head to one
      if (
        unitCurrentTile instanceof CityTile ||
        unitCurrentTile == null ||
        unitCurrentMap == null
      ) {
        unit.setSleeping();
        return;
      }
      this.goToNearestPointOfSafety(unit, unitCurrentTile, unitCurrentMap);
      return;
    }
  }

  valueTile(hexTile: HexTile) {
    let value = 0;
    if (hexTile instanceof PortalTile) {
      value += 3;
    } else if (
      hexTile instanceof GrasslandTile ||
      hexTile instanceof PlainsTile ||
      hexTile instanceof HillTile
    ) {
      // all have good base yield
      // TODO: maybe adapt to what current player is lacking
      value += 1;
    }
    if (hexTile.hasTileImprovement()) {
      // somewhat valuable, but currently tile improvements are quite cheap to construct
      value += 0.5;
    }
    // special resources are quite rare so valuable
    // TODO: value differently depending on the quantity present
    const iron = hexTile.getAllResources().iron ?? 0;
    const wood = hexTile.getAllResources().wood ?? 0;
    if (iron > 0) {
      value += 2;
    }
    if (wood > 0) {
      value += 1;
    }
    return value;
  }

  valueSettlePosition(hexTile: HexTile): number {
    // TODO: use dynamic programming to avoid re-caldulation of valueTile
    // TODO: maybe add account for how settling will affect placement of more cities
    // consider nearby tiles
    const tilesWithinThree = hexTile.getAllTilesWithinDistance(3);
    let totalValue = 0;
    for (let tile of tilesWithinThree) {
      totalValue += this.valueTile(tile);
    }
    return totalValue;
  }

  // findBestSettlePositionInRealm(realmMap: GameMap): {
  //   tile: HexTile;
  //   valuation: number;
  // } | null {
  //   let bestPositionSoFar: HexTile | null = null;
  //   let bestValuationSoFar = 0;
  //   for (let row = 0; row < realmMap.nRows; row++) {
  //     for (let col = 0; col < realmMap.nCols; col++) {
  //       const tile = realmMap.getTile(row, col)!;
  //       if (Settler.canSettleOn(tile)) {
  //         const valuation = this.valueSettlePosition(tile);
  //         if (bestPositionSoFar == null || valuation > bestValuationSoFar) {
  //           bestPositionSoFar = realmMap.getTile(row, col)!;
  //           bestValuationSoFar = valuation;
  //         }
  //       }
  //     }
  //   }
  //   if (bestPositionSoFar == null) return null;
  //   return {
  //     tile: bestPositionSoFar,
  //     valuation: bestValuationSoFar,
  //   };
  // }

  // chooseSettlePosition(gameSketch: RealmsSketch) {
  //   let bestPositionSoFar: HexTile | null = null;
  //   let bestValuationSoFar = 0;
  //   for (let map of gameSketch.getMaps()) {
  //     const result = this.findBestSettlePositionInRealm(map);
  //     if (result != null) {
  //       const { tile, valuation } = result;
  //       if (bestPositionSoFar == null || valuation > bestValuationSoFar) {
  //         bestPositionSoFar = tile;
  //         bestValuationSoFar = valuation;
  //       }
  //     }
  //   }
  //   return bestPositionSoFar;
  // }

  getRealmsAccessibleToPlayer(gameSketch: RealmsSketch) {
    const portalTilesInTerritory =
      gameSketch.getMainRealmPortalTilesBelongingToPlayer(this);
    return portalTilesInTerritory.map((mainRealmPortalTile) => {
      return mainRealmPortalTile.portal.getOtherEndMapAndTile(
        mainRealmPortalTile
      ).map;
    });
  }

  chooseSettlePosition(gameSketch: RealmsSketch) {
    // pick a random accessible realm
    const accessibleRealms = this.getRealmsAccessibleToPlayer(gameSketch);
    if (accessibleRealms.length === 0) return null;
    const settlableTiles = Settler.getSettelableTiles(
      randomElement(accessibleRealms)!
    );
    if (settlableTiles.length === 0) return null;
    let maxValuationTile: HexTile | null = null;
    let maxValuation = 0;
    for (let tile of settlableTiles) {
      if (Math.random() < 0.2 || maxValuationTile == null) {
        const valuation = this.valueSettlePosition(tile);
        if (maxValuationTile == null || valuation > maxValuation) {
          maxValuationTile = tile;
          maxValuation = valuation;
        }
      }
    }
    return maxValuationTile;
  }

  chooseUnitActionColoniseRealms(gameSketch: RealmsSketch, unit: Unit) {
    if (unit instanceof MillitaryUnit) {
      if (this.defendClosestUndefendedPortalTile(unit)) return;
      // TODO: defend closest civil unit
      // otherwise just sleep
      unit.setSleeping();
      return;
    } else if (unit instanceof Settler) {
      const timeStarted = Date.now();
      if (unit.currentTile && Settler.canSettleOn(unit.currentTile)) {
        gameSketch.handleUnitSettleCity(unit);
      } else {
        const settlePosition = this.chooseSettlePosition(gameSketch);
        console.log(
          "time taken to choose location to settle: " +
            (Date.now() - timeStarted)
        );
        if (settlePosition != null) {
          unit.movementTarget = settlePosition;
          unit.selectCurrentMovementTarget();
        }
      }
    } else {
      unit.setSleeping();
    }
  }

  chooseUnitAction(gameSketch: RealmsSketch, unit: Unit): void {
    switch (this.state) {
      case "control-portals":
        this.chooseUnitActionControlPortals(gameSketch, unit);
        break;
      case "colonise-realms":
        this.chooseUnitActionColoniseRealms(gameSketch, unit);
        break;
    }
  }
}

export default FSMAIPlayer;
