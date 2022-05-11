import City from "../cities/city";
import { ProductionItem, ProductionItemName } from "../cities/production";
import CityTile from "../grid/tiles/city";
import PortalTile from "../grid/tiles/portal";
import RealmsSketch from "../sketch/realms-sketch";
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

  productionPreferenceColoniseRealms(
    gameSketch: RealmsSketch
  ): ProductionPreference {
    let productionPreference: ProductionPreference = [];
    const portalTilesInTerritory =
      gameSketch.getMainRealmPortalTilesBelongingToPlayer(this);
    const undefendedPortalTilesInTerritory = portalTilesInTerritory.filter(
      (tile) => !tile.containsMillitaryUnit()
    );
    if (undefendedPortalTilesInTerritory.length > 0) {
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

  flee() {}

  attack() {}

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
        const closestUndefendedPortalTile =
          unitCurrentTile?.findTileMatchingPredicate(
            (tile) =>
              tile instanceof PortalTile && !tile.containsMillitaryUnit(),
            10,
            true
          );
        if (closestUndefendedPortalTile != null) {
          unit.movementTarget = closestUndefendedPortalTile;
          unit.selectCurrentMovementTarget();
          return;
        }
        // TODO: potentially move to colonise state
        unit.setSleeping();
        return;
      }
    } else {
      // if not already in a city then head to one
      if (unitCurrentTile instanceof CityTile || unitCurrentTile == null) {
        unit.setSleeping();
        return;
      }
      // find the closest city tile
      const closestCityTile = unitCurrentMap?.getClosestCityTo(
        unitCurrentTile,
        unit.owner
      );
      if (closestCityTile != null) {
        unit.movementTarget = closestCityTile;
        unit.selectCurrentMovementTarget();
        return;
      } else {
        // just hunked down and hope
        // TODO: maybe seek out closest millitary unit
        unit.setSleeping();
        return;
      }
    }
  }

  chooseUnitAction(gameSketch: RealmsSketch, unit: Unit): void {
    switch (this.state) {
      case "control-portals":
        this.chooseUnitActionControlPortals(gameSketch, unit);
        break;
    }
  }
}

export default FSMAIPlayer;
