import City from "../cities/city";
import { ProductionItem } from "../cities/production";
import Empire from "../empires/empire";
import CityTile from "../grid/tiles/city";
import {
  addResourceQuantities,
  AllResourceTypes,
  ResourceQuantity,
} from "../resources";
import RealmsSketch from "../sketch/realms-sketch";
import Caravan from "../units/civil/caravan";
import CivilUnit from "../units/civil/civil-unit";
import MillitaryUnit from "../units/millitary/millitary-unit";
import Unit from "../units/unit";
import { randomElement, randomInt } from "../utils/random";
import AIPlayer from "./ai-player";

class RandomAIPlayer extends AIPlayer {
  constructor(empire: Empire) {
    super(empire);
  }

  public chooseCityProduction(
    gameSketch: RealmsSketch,
    possibleProductionItems: ProductionItem[],
    city: City
  ): ProductionItem {
    return randomElement(possibleProductionItems)!;
  }

  private randomMove(realmsSketch: RealmsSketch, unit: Unit): boolean {
    const randomMovementTarget = realmsSketch.getRandomTile();
    if (!randomMovementTarget) return false;
    unit.movementTarget = randomMovementTarget;
    unit.selectCurrentMovementTarget();
    return true;
  }

  private sleep(unit: Unit) {
    unit.setSleeping();
    return true;
  }

  private transferResources(
    gameSketch: RealmsSketch,
    unit: CivilUnit
  ): boolean {
    const currentTile = unit.currentTile;
    if (!currentTile || !(currentTile instanceof CityTile)) return false;
    const city = currentTile.getCity()!;
    const originalCityResourceQuantity = city.getTransferrableResources();
    const unitResouces = unit.getResouces();
    const totalResources = addResourceQuantities(
      originalCityResourceQuantity,
      unitResouces
    );
    let unitResourceQuantity: ResourceQuantity = {};
    let cityResourceQuantity: ResourceQuantity = {};
    for (let _resource of Object.keys(totalResources)) {
      const resource = _resource as AllResourceTypes;
      const totalQuantity = totalResources[resource] ?? 0;
      if (totalQuantity > 0) {
        const newUnitQuantity = randomInt(0, totalQuantity);
        const newCityQuantity = totalQuantity - newUnitQuantity;
        unitResourceQuantity[resource] = newUnitQuantity;
        cityResourceQuantity[resource] = newCityQuantity;
      }
    }
    unit.clearResources();
    unit.addResources(unitResourceQuantity);
    city.setTransferableResources(cityResourceQuantity);
    return true;
  }

  private constructFarm(gameSketch: RealmsSketch, unit: Unit): boolean {
    const currentTile = unit.currentTile;
    if (!currentTile) return false;
    currentTile.addTileImprovement(gameSketch, "farm");
    return true;
  }

  private constructMine(gameSketch: RealmsSketch, unit: Unit): boolean {
    const currentTile = unit.currentTile;
    if (!currentTile) return false;
    currentTile.addTileImprovement(gameSketch, "mine");
    return true;
  }

  private constructLumberMill(gameSketch: RealmsSketch, unit: Unit): boolean {
    const currentTile = unit.currentTile;
    if (!currentTile) return false;
    currentTile.addTileImprovement(gameSketch, "lumber-mill");
    return true;
  }

  private meleeAttack(gameSketch: RealmsSketch, unit: MillitaryUnit): boolean {
    const currentTile = unit.currentTile;
    if (!currentTile) return false;
    const possibleTargets = unit.getAttackableTargets();
    if (possibleTargets.length === 0) return false;
    const targetTile = randomElement(possibleTargets)!;
    const enemyUnitsOnTile = targetTile
      .getUnits()
      .filter((unit) => unit instanceof MillitaryUnit);
    if (enemyUnitsOnTile.length === 0) return false;
    const enemyUnit = randomElement(enemyUnitsOnTile)!;
    unit.meleeAttack(enemyUnit);
    return true;
  }

  private transport(gameSketch: RealmsSketch, unit: Caravan): boolean {
    const currentTile = unit.currentTile;
    if (!currentTile) return false;
    const possibleTargets = gameSketch.getCitiesBelongingToPlayer(unit.owner);
    if (possibleTargets.length === 0) return false;
    const targetCity = randomElement(possibleTargets)!;
    unit.startTransportingTo(targetCity);
    return true;
  }

  public chooseUnitAction(gameSketch: RealmsSketch, unit: Unit): void {
    let madeDecision = false;
    while (!madeDecision) {
      switch (randomElement(unit.getCurrentPossibleUnitActionTypes())) {
        case "move":
          madeDecision = this.randomMove(gameSketch, unit);
          break;
        case "sleep":
          madeDecision = this.sleep(unit);
          break;
        case "transfer-resources":
          madeDecision = this.transferResources(gameSketch, unit as CivilUnit);
          break;
        case "construct-farm":
          madeDecision = this.constructFarm(gameSketch, unit);
          break;
        case "construct-mine":
          madeDecision = this.constructMine(gameSketch, unit);
          break;
        case "construct-lumber-mill":
          madeDecision = this.constructLumberMill(gameSketch, unit);
          break;
        case "melee-attack":
          madeDecision = this.meleeAttack(gameSketch, unit as MillitaryUnit);
          break;
        case "transport":
          madeDecision = this.transport(gameSketch, unit as Caravan);
          break;
      }
    }
  }
}

export default RandomAIPlayer;
